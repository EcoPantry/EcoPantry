# Perform Prisma migration inside BE container

`docker-compose exec backend bunx prisma migrate dev --name init`

aws ecr get-login-password --profile AdministratorAccess-878122414245 --region ap-southeast-1 | docker login --username AWS --password-stdin 878122414245.dkr.ecr.ap-southeast-1.amazonaws.com

docker build -t <image-name>:<tag> .

docker tag <local-image-name>:<tag> <account-id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:<tag>

docker push <account-id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:<tag>
