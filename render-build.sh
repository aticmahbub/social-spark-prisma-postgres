set -o errexit

npx install
npx build
npx prisma generate
npx prisma migrate deploy
