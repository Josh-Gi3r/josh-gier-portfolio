# josh-gier.com

Custom domain attached to the existing portfolio Site on 6 September 2026. Hosting is prepared; DNS has not been changed because this conversation has no connected DNS-management capability. The Namecheap plugin offered by discovery only supplies availability/pricing, and no Cloudflare plugin was returned.

- Site: `appgprj_6a9d8815a2d4819183adbcff0d0d8866`
- Domain: `josh-gier.com`
- Domain binding: `appgdom_6a9dcf36dcf08191993fd2b056767ba4`
- Last confirmed provider state: pending; SSL pending validation. A final native domain listing confirmed this state; activation is not claimed.

## Exact records returned by hosting

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `162.159.143.30` |
| A | `@` | `172.66.3.26` |
| TXT | `_openai-site-verification` | `openai-site-verification=1_q4mPZ0uDGHP03JdLtCQuV4Sqz6NRzJ74HC1LfqP7E` |
| TXT | `_cf-custom-hostname` | `e67cad15-5dc6-4847-8592-3bbc112e460b` |

The provider also returned `custom-domains.chatgpt.site.` as its CNAME target for subdomains. This binding is the apex, so use the two returned A targets above.

## Complete the connection

1. Obtain the domain's authoritative DNS records through a connected DNS-management tool. Check its existing website records before replacing the apex routing; preserve mail and unrelated records.
2. Set the exact A and TXT records above. `josh-gier.com.dns` contains them in DNS zone format for import where supported.
3. Refresh this exact domain binding through Sites. Follow any additional validation records returned by the provider and wait for active routing and SSL.
4. The Site still uses its owner-only review audience. For the final public portfolio launch, enable the intended public audience and verify it along with domain activation. DNS attachment alone must not be described as a public launch.

No Namecheap, Cloudflare, Railway, mail or nameserver configuration was changed in this revision. No second hosting service is required for this static portfolio.
