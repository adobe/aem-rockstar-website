# N8N Form Block

A generic form block that submits to an n8n webhook. You configure the form title, description, thank-you message, and fields via the block table. Data is sent as `application/x-www-form-urlencoded` with an optional `timestamp` (ISO string).

## Authoring

Add a block named **n8n-form** and configure it with a table.

### Table structure

The first row is often the block name (`n8n-form`) in the first cell; that row is ignored. Data rows are then:

| Data row | Content |
|----------|--------|
| **Row 0** | Webhook URL (required). Your n8n webhook URL. |
| **Row 1** | Form title (optional). Default: `Sign up`. |
| **Row 2** | Form description (optional). Single cell. |
| **Row 3** | Thank-you title (optional). Single cell. Default: `Thank you!`. |
| **Row 4** | Thank-you message (optional). Single cell. Default: *We've received your information and will be in touch soon.* |
| **Row 3+** | One row per field. First row with **2+ cells** starts the field definitions. See [Field rows](#field-rows) below. |

Optional single-cell rows (description, thank-you title, thank-you message) are read in order before the first multi-cell row. If row 2 has 2+ cells, it is treated as the first field row and there is no description or thank-you config.

If you do **not** add any field rows (only URL and optionally title/description), the block shows two default fields: **Name** and **Email**.

### Field rows

From row 3 onward, each row defines one form field. Use one row per field with these columns (cells):

| Column | Meaning | Example |
|--------|--------|--------|
| 1 – Label | Label shown next to the field | `Full Name` |
| 2 – Name | Payload key sent to n8n (letters, numbers, `_`, `-` only) | `name` |
| 3 – Type | Input type | `text`, `email`, `tel`, `number`, `url` |
| 4 – Required | Whether the field is required | `yes` / `no` (default: `yes`) |
| 5 – Placeholder | Placeholder text (optional) | `Your name` |

### Minimal example (default fields)

Only the webhook URL; title defaults to "Sign up" and fields default to Name + Email:

```
| n8n-form |
| https://your-n8n.com/webhook/abc123 |
```

### Example with title and description

```
| n8n-form |
| https://your-n8n.com/webhook/abc123 |
| Newsletter |
| Get updates in your inbox. |
```

### Example with custom thank-you message

```
| n8n-form |
| https://your-n8n.com/webhook/abc123 |
| Newsletter |
| Get updates in your inbox. |
| You're on the list! |
| We'll send the first edition soon. |
```

(Rows 3 and 4 are the success title and message. Add field rows after that.)

### Example with custom fields

```
| n8n-form |
| https://your-n8n.com/webhook/abc123 |
| Contact us |
| We'll get back to you soon. |
| Full Name | name | text | yes | Your name |
| Email | email | email | yes | you@example.com |
| Company | company | text | no | Optional |
| Phone | phone | tel | no | +1 234 567 8900 |
```

## Payload

On submit, the block sends a POST request to the webhook with:

- **Content-Type:** `application/x-www-form-urlencoded`
- **Body:** one parameter per form field, plus:
  - `timestamp` – ISO 8601 string (e.g. `2026-02-18T14:30:00.000Z`)

Example body (with default Name + Email):

- `name=Jane+Doe`
- `email=jane%40example.com`
- `timestamp=2026-02-18T14%3A30%3A00.000Z`

## Behavior

- **Validation:** Required fields are validated before submit; invalid fields are focused.
- **Loading state:** While submitting, the form is disabled and the button shows "Submitting...".
- **Success:** On success, the form is replaced by a thank-you message.
- **Error:** On network or server error, an error message is shown above the form and the submit button is restored.

## Files

- `blocks/n8n-form/n8n-form.js`
- `blocks/n8n-form/n8n-form.css`
- `blocks/n8n-form/README.md`
