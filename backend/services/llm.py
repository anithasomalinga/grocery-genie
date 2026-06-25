import json
import re
import anthropic

client = anthropic.Anthropic()

SYSTEM_PROMPT = """You are a receipt parser. Given raw OCR text from a grocery receipt, extract structured data and return ONLY valid JSON with no markdown, no explanation, no code fences.

Return this exact schema:
{
  "store_name": "string or null",
  "purchase_date": "YYYY-MM-DD or null",
  "items": [
    {
      "name": "string",
      "price": number,
      "quantity": integer,
      "category": "one of: Produce, Dairy, Meat, Bakery, Beverages, Snacks, Frozen, Pantry, Household, Personal Care, Other"
    }
  ]
}

Rules:
- price is the total line price (unit price × quantity)
- quantity defaults to 1 if not specified
- category must be one of the listed values
- If you cannot determine a field, use null
- Do not include tax lines, totals, or subtotals as items"""


def parse_receipt(raw_text: str) -> dict:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": f"Parse this grocery receipt:\n\n{raw_text}",
            }
        ],
        system=SYSTEM_PROMPT,
    )

    content = message.content[0].text.strip()

    # Strip markdown code fences if present
    content = re.sub(r"^```(?:json)?\s*", "", content)
    content = re.sub(r"\s*```$", "", content)

    return json.loads(content)
