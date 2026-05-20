import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.cities import Cities

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class CitiesService:
    """Service layer for Cities operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Cities]:
        """Create a new cities"""
        try:
            obj = Cities(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created cities with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating cities: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Cities]:
        """Get cities by ID"""
        try:
            query = select(Cities).where(Cities.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching cities {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of citiess"""
        try:
            query = select(Cities)
            count_query = select(func.count(Cities.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Cities, field):
                        query = query.where(getattr(Cities, field) == value)
                        count_query = count_query.where(getattr(Cities, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Cities, field_name):
                        query = query.order_by(getattr(Cities, field_name).desc())
                else:
                    if hasattr(Cities, sort):
                        query = query.order_by(getattr(Cities, sort))
            else:
                query = query.order_by(Cities.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching cities list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Cities]:
        """Update cities"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Cities {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated cities {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating cities {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete cities"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Cities {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted cities {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting cities {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Cities]:
        """Get cities by any field"""
        try:
            if not hasattr(Cities, field_name):
                raise ValueError(f"Field {field_name} does not exist on Cities")
            result = await self.db.execute(
                select(Cities).where(getattr(Cities, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching cities by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Cities]:
        """Get list of citiess filtered by field"""
        try:
            if not hasattr(Cities, field_name):
                raise ValueError(f"Field {field_name} does not exist on Cities")
            result = await self.db.execute(
                select(Cities)
                .where(getattr(Cities, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Cities.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching citiess by {field_name}: {str(e)}")
            raise