'use strict'
const check = require('express-validator/check').check
var CPF = require('cpf_cnpj').CPF

module.exports =
  [
    check('operadora')
      .isLength({ min: 1 })
      .withMessage('Operadora em branco'),
    check('numeroContrato')
      .isLength({ min: 1 })
      .withMessage('Número do contrato em branco'),
    check('codigoEmpresa')
      .isLength({ min: 1 })
      .withMessage('Código da empresa em branco'),
    check('versaoContrato')
      .isLength({ min: 1 })
      .withMessage('Versão do Contrato em branco'),
    check('subContrato')
      .isLength({ min: 1 })
      .withMessage('subContrato em branco'),
    check('versaoSubContrato')
      .isLength({ min: 1 })
      .withMessage('Versão SubContrato em branco'),
    check('cpfTitular')
      .isLength({ min: 1 })
      .withMessage('CPF titular em branco')
      .custom((value) => {
        if (!CPF.isValid(value)) {
          throw new Error('CPF titular Inválido')
        } else {
          return true
        }
      }),
    check('cpfTitular')
      .isLength({ min: 11, max: 11 })
      .withMessage('CPF do titular deve conter 11 digitos.'),
    check('codigoProduto')
      .isLength({ min: 1 })
      .withMessage('Codigo do produto em branco'),
    check('versaoProduto')
      .isLength({ min: 1 })
      .withMessage('Versão do produto em branco'),
    check('nomeBeneficiario')
      .isLength({ min: 1 })
      .withMessage('Nome do beneficiário em branco'),
    check('tipo')
      .isLength({ min: 1 })
      .withMessage('Se é titular ou Depentende está em branco')
      .custom((value) => {
        if (value != 'T' && value != 'D') {
          throw new Error('Este campo aceita somente T ou D')
        } else {
          return true
        }
      }),
    check('dataNascimento')
      .isLength({ min: 1 })
      .withMessage('Data de nascimento em branco'),
    check('parentesco')
      .isLength({ min: 1 })
      .withMessage('Grau de parentesco em branco'),
    check('sexo')
      .isLength({ min: 1 })
      .withMessage('Sexo em branco'),
    check('cep')
      .isLength({ min: 1 })
      .withMessage('CEP em branco'),
    check('logradouro')
      .isLength({ min: 1, max: 40 })
      .withMessage('Campo Logradouro deve ter no mínimo 1 caracter e no máximo 40'),
    check('numero')
      .isLength({ min: 1 })
      .withMessage('Número do logradouro em branco'),
    check('bairro')
      .isLength({ min: 1, max: 20 })
      .withMessage('Bairro deve ter no mínimo 1 caracter e no máximo 20'),
    check('codigoMunicipio')
      .isLength({ min: 1 })
      .withMessage('Código do município em branco'),
    check('uf')
      .isLength({ min: 1 })
      .withMessage('UF em branco'),
    check('ddd')
      .isLength({ min: 1 })
      .withMessage('DDD em branco'),
    check('telefone')
      .isLength({ min: 1 })
      .withMessage('Telefone em branco'),
    check('nomeMae')
      .isLength({ min: 1 })
      .withMessage('Nome da mãe em branco'),
    check('nomeTitular')
      .isLength({ min: 1 })
      .withMessage('Nome do titular não foi informado'),
    check('codigofuncao')
      .isLength({ max: 20 })
      .withMessage('Código de função deve ter no máximo 20 caracteres'),
    check('matricula')
      .isLength({ max: 50 })
      .withMessage('Matrícula da empresa só pode conter no máximo 40 caracteres'),
  ]
