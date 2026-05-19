import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.states import States

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class StatesService:
    """Service layer for States operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[States]:
        """Create a new states"""
        try:
            obj = States(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created states with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating states: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[States]:
        """Get states by ID"""
        try:
            query = select(States).where(States.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching states {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of statess"""
        try:
            query = select(States)
            count_query = select(func.count(States.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(States, field):
                        query = query.where(getattr(States, field) == value)
                        count_query = count_query.where(getattr(States, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(States, field_name):
                        query = query.order_by(getattr(States, field_name).desc())
                else:
                    if hasattr(States, sort):
                        query = query.order_by(getattr(States, sort))
            else:
                query = query.order_by(States.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching states list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[States]:
        """Update states"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"States {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated states {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating states {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete states"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"States {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted states {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting states {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[States]:
        """Get states by any field"""
        try:
            if not hasattr(States, field_name):
                raise ValueError(f"Field {field_name} does not exist on States")
            result = await self.db.execute(
                select(States).where(getattr(States, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching states by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[States]:
        """Get list of statess filtered by field"""
        try:
            if not hasattr(States, field_name):
                raise ValueError(f"Field {field_name} does not exist on States")
            result = await self.db.execute(
                select(States)
                .where(getattr(States, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(States.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching statess by {field_name}: {str(e)}")
            raise