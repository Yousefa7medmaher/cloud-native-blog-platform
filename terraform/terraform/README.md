# terraform/

AWS infrastructure as code for JooBlog. Written as reusable **modules**
composed into separate **per-environment** stacks, which is the standard
pattern for keeping dev/staging/prod isolated (separate state, separate
`.tfvars`) while sharing the same underlying module code.

## Folder structure

```
terraform/terraform/
├── bootstrap/            # one-time setup (e.g. S3 bucket + lock table for remote state)
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
│       ├── main.tf                  # wires modules together for this env
│       ├── variables.tf             # input variables for this env
│       ├── outputs.tf               # outputs (URLs, ARNs, etc.)
│       ├── backend.tf               # remote state backend config
│       ├── backend.hcl.example      # example backend config values
│       ├── terraform.tfvars         # actual values for this env (often gitignored/secret)
│       └── terraform.tfvars.example # template to copy from
└── modules/
    ├── vpc/               # networking: VPC, subnets, route tables, NAT/IGW
    ├── security-group/    # reusable security group definitions
    ├── ec2 / compute/     # EC2 instances / compute layer running the backend
    ├── alb / load-balancer/ # Application Load Balancer + target groups
    ├── documentdb/        # MongoDB-compatible managed database (replaces local mongo)
    ├── s3/                # S3 buckets (media storage, frontend static hosting)
    ├── frontend-s3/       # S3 + static website config specifically for the SPA
    ├── cloudfront/        # CDN in front of the frontend S3 bucket
    ├── route53/            # DNS records
    ├── iam/                # IAM roles/policies
    ├── secrets/            # Secrets Manager / parameter store entries
    └── github-oidc/        # OIDC trust so GitHub Actions can deploy without long-lived AWS keys
```

## How it fits together

Each environment (`dev`, `staging`, `prod`) has its own `main.tf` that calls
these modules to build a full stack: VPC → security groups → compute (backend)
behind an ALB → DocumentDB → S3/CloudFront (frontend) → Route53 DNS. IAM and
`github-oidc` support CI/CD deploys; `secrets` holds things like JWT signing
keys and DB credentials so they're never hardcoded in `.tfvars`.

This mirrors the local docker-compose stack conceptually:

| Local (docker-compose) | AWS (Terraform)             |
|-------------------------|------------------------------|
| `mongodb` container      | `documentdb` module           |
| `backend` container      | `compute`/`ec2` + `alb` modules |
| `frontend` container (nginx) | `frontend-s3` + `cloudfront` modules |
| — | `route53` for the public domain |
| — | `secrets`, `iam`, `github-oidc` for secure ops/CI |

## Usage

1. **Bootstrap once per AWS account** (creates the remote state backend):
   ```bash
   cd bootstrap
   terraform init
   terraform apply
   ```

2. **Per environment**, e.g. `dev`:
   ```bash
   cd environments/dev
   cp terraform.tfvars.example terraform.tfvars   # fill in real values
   cp backend.hcl.example backend.hcl             # fill in state backend values
   terraform init -backend-config=backend.hcl
   terraform plan
   terraform apply
   ```

Repeat the same steps under `environments/staging` or `environments/prod` —
never apply `prod` changes without going through `plan` first and reviewing
the diff.

## Notes

- Some modules (`compute`, `iam`, `load-balancer`, `s3`, `security-group`,
  `vpc`) have their own `README.md` with module-specific inputs/outputs —
  check those before reusing a module elsewhere.
- Keep `terraform.tfvars` and any real secrets out of version control; only
  the `.example` files should be committed.