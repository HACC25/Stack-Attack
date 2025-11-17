from datetime import datetime, timezone
import json
from src.utils.postgres.models import TokenUsage
from sqlalchemy.ext.asyncio import AsyncSession


def is_json(content: str) -> bool:
    try:
        json.loads(content)
        return True
    except Exception as e:
        return False


async def reset_daily_usage_if_needed(db: AsyncSession, usage: TokenUsage):
    now = datetime.now(timezone.utc)
    last_reset = usage.daily_reset_at

    today_midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)

    if last_reset < today_midnight:
        print("RESETTING DAILY TOKENS")
        usage.daily_tokens = 0
        usage.daily_reset_at = now
        await db.commit()
        await db.refresh(usage)

    return usage
