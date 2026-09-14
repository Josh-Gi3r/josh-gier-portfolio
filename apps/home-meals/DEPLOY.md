# Home Meals deployment

Production is deployed on Railway from the Home Meals app inside this repository.

- Railway project: `home-meals`
- Service: `home-meals-web`
- Source repository: `Josh-Gi3r/josh-gier-portfolio`
- Source branch: `main`
- Service root: `apps/home-meals`
- Build command: `npm run build`
- Start command: `npm start`
- Production domain: `meals.josh-gier.com`
- Railway service domain: `home-meals-web-production.up.railway.app`
- Region: `asia-southeast1-eqsg3a`
- Healthcheck: `/`

The app uses Railway Postgres for shared Josh + G household state. Production deploys are expected to use the exact accepted `main` commit after Home Meals CI passes.
