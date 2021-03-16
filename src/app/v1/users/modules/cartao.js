'use strict'

// const monitorNewRelic = require('../../../../../lib/noticeErrorNewRelic')
const asyncCust = require('../../../../libs/waterfall')
// const requestProtheus = require('../../../../../lib/requestProtheus')
// const log = require('../../../../../lib/log')
const async = require('async')

// const dbConfig = require('../../../../../config/dbconfig')
// const oracledb = require('oracledb')
// oracledb.outFormat = oracledb.OBJECT

// const sqlBA1 = require('../sql/buscarUsuario')
// const sqlBED = require('../sql/buscarDadosCartao')

module.exports = (params) => {
  return new Promise((resolve, reject) => {
    asyncCust(
      [
        (done) => {
          oracledb.getConnection(dbConfig, done)
        },
        (conn, done) => {
          let dados = []
          async.forEachOf(params.beneficiarios, (value, key) => {
            let bindVars = {
              operadora: value.matricula.substring(0, 4),
              codigoEmpresa: value.matricula.substring(4, 8),
              matricula: value.matricula.substring(8, 14),
              tipoRegistro: value.matricula.substring(14, 16),
              digito: value.matricula.substring(16, 17),
            }
            conn
              .execute(sqlBA1, bindVars)
              .then((result, err) => {
                if (err) {
                  monitorNewRelic(new Error('Ocorreu algum problema ao conectar'), null, null, params)
                  done(new Error('Ocorreu algum problema ao conectar'), conn)
                } else {
                  if (result.rows.length == 0) {
                    monitorNewRelic(new Error('Beneficiário não cadastrado'), null, null, params)
                    done(new Error('Beneficiário não cadastrado'), conn)
                  } else {
                    dados[key] = result.rows
                    dados[key].cpfTitular = params.cpf_titular
                    dados[key].motivo = params.motivo
                    dados[key].codMotivo = params.id_motivo_solic_cartao
                    dados[key].idSolicitacaoCartao = params.id_solicitacao_cartao
                    if (key == params.beneficiarios.length - 1) {
                      done(null, conn, dados)
                    }
                  }
                }
              })
              .catch(err => {
                monitorNewRelic(err, null, null, params)
                done(err, conn)
              })
          })
        },
        (conn, dados, done) => {
          /* MOTIVOS ----
          1	VIA DE CARTAO (PERDA)                   
          2	RENOVACAO DE CONTRATO PJ (CUSTO OPER)   
          3	RENOVACAO DE CONTRATO PF PJ (PRE-PAGTO) 
          4	EMISSAO DA PRIMEIRA VIA                 
          5	VIA DE CARTAO (ROUBO)                   
          6	VIA DE CARTAO (ALT. DADOS CADASTRAIS)   
          7	REEMISSAO DE CARTAO                     
          8	REEMISSAO DE CARTAO CORTESIA            */

          const codMotivo = dados[0].codMotivo == 121 ? 8 : 7

          const param = `<api:CARTAO>
                  <api:OPERADORA>${dados[0][0].BA1_CODINT}</api:OPERADORA>
                  <api:MOTIVO>${codMotivo}</api:MOTIVO>
                  <api:MATRICULA>${dados[0][0].MATRICULABENEFICIARIO}</api:MATRICULA>
                 </api:CARTAO>`

          requestProtheus('WS_CARTAO', 'CARTAO', param, 50000)
            .then((cartao) => {
              cartao = cartao.CARTAORESPONSE.CARTAORESULT

              if (cartao.STATUS === 'false') {
                //done(new Error(cartao.MENSAGEM), conn)
                dados.retornoCartao = cartao.MENSAGEM
                done(null, conn, dados)
              } else {
                dados.retornoCartao = cartao.MENSAGEM
                done(null, conn, dados)
              }
            })
            .catch(err => {
              monitorNewRelic(err, null, 'Erro na API do protheus', param)
              done(err, conn)
            })
        },
        (conn, dados, done) => {
          let bindVars = {
            operadora: dados[0][0].BA1_CODINT,
            codigoEmpresa: dados[0][0].BA1_CODEMP,
            matricula: dados[0][0].BA1_MATRIC,
            tipoRegistro: dados[0][0].BA1_TIPREG,
            stacar: 1,
          }

          conn
            .execute(sqlBED, bindVars)
            .then((result, err) => {
              if (err) {
                monitorNewRelic(new Error(err), null, null, bindVars)
                done(new Error('Ocorreu algum problema ao conectar'), conn)
              } else {
                if (result.rows.length == 0) {
                  dados.retornoCartao = 'Cartão não gerado'
                  dados.dadosCartao = [{ BED_NOMUSR: '' }]
                  done(null, conn, dados)
                  //done(new Error('Cartão não gerado'), conn)
                } else {
                  dados.dadosCartao = result.rows
                  done(null, conn, dados)
                }
              }
            })
            .catch((err) => {
              monitorNewRelic(err, null, null, bindVars)
              done(new Error(err), conn)
            })
        },
        (conn, dados, done) => {
          log({
            servico: 'SOLICITAO-CARTAO',
            login: dados.dadosCartao[0].BED_NOMUSR,
            chave: dados[0][0].MATRICULABENEFICIARIO,
            mensagem: dados[0].idSolicitacaoCartao,
          }).
            then(() => { })
            .catch((err) => {
              monitorNewRelic(new Error(err), null, null, params)
              done(new Error(err), conn)
            })

          done(null, conn, dados)
        },
        (conn, dados) => {
          if (conn) conn.close()
          let payload = {
            mensagem: dados.retornoCartao,
          }
          resolve(payload)
        },
      ],
      (err, conn) => {
        if (conn) conn.close()
        reject(err)
      }
    )
  })
}