set -o errexit

pnpm install
pnpm build
pnpm prisma generate
pnpm prisma migrate deploy
