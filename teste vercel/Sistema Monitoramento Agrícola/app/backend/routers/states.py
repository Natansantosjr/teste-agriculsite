import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.states import StatesService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/states", tags=["states"])


# ---------- Pydantic Schemas ----------
class StatesData(BaseModel):
    """Entity data schema (for create/update)"""
    name: str
    uf: str
    region_id: int


class StatesUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    name: Optional[str] = None
    uf: Optional[str] = None
    region_id: Optional[int] = None


class StatesResponse(BaseModel):
    """Entity response schema"""
    id: int
    name: str
    uf: str
    region_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class StatesListResponse(BaseModel):
    """List response schema"""
    items: List[StatesResponse]
    total: int
    skip: int
    limit: int


class StatesBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[StatesData]


class StatesBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: StatesUpdateData


class StatesBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[StatesBatchUpdateItem]


class StatesBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=StatesListResponse)
async def query_statess(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query statess with filtering, sorting, and pagination"""
    logger.debug(f"Querying statess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = StatesService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
        )
        logger.debug(f"Found {result['total']} statess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying statess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=StatesListResponse)
async def query_statess_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query statess with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying statess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = StatesService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} statess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying statess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=StatesResponse)
async def get_states(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single states by ID"""
    logger.debug(f"Fetching states with id: {id}, fields={fields}")
    
    service = StatesService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"States with id {id} not found")
            raise HTTPException(status_code=404, detail="States not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching states {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=StatesResponse, status_code=201)
async def create_states(
    data: StatesData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new states"""
    logger.debug(f"Creating new states with data: {data}")
    
    service = StatesService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create states")
        
        logger.info(f"States created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating states: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating states: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[StatesResponse], status_code=201)
async def create_statess_batch(
    request: StatesBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple statess in a single request"""
    logger.debug(f"Batch creating {len(request.items)} statess")
    
    service = StatesService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} statess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[StatesResponse])
async def update_statess_batch(
    request: StatesBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple statess in a single request"""
    logger.debug(f"Batch updating {len(request.items)} statess")
    
    service = StatesService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} statess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=StatesResponse)
async def update_states(
    id: int,
    data: StatesUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing states"""
    logger.debug(f"Updating states {id} with data: {data}")

    service = StatesService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"States with id {id} not found for update")
            raise HTTPException(status_code=404, detail="States not found")
        
        logger.info(f"States {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating states {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating states {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_statess_batch(
    request: StatesBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple statess by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} statess")
    
    service = StatesService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} statess successfully")
        return {"message": f"Successfully deleted {deleted_count} statess", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_states(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single states by ID"""
    logger.debug(f"Deleting states with id: {id}")
    
    service = StatesService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"States with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="States not found")
        
        logger.info(f"States {id} deleted successfully")
        return {"message": "States deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting states {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")