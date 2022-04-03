## Compilar uma imagem docker
```bash
docker build -t temp-ubuntu .
```

## Lista imagens docker
```bash
docker images
```

## Remover uma imagem docker
```bash
docker rmi temp-ubuntu:version-1.0
```

## Como exibir os contêineres disponíveis
```bash
docker ps -a
```

## Como executar um contêiner
```bash
docker run -d tmp-ubuntu
```