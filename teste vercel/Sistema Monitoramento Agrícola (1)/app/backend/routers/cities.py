import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.cities import CitiesService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/cities", tags=["cities"])


# ---------- Pydantic Schemas ----------
class CitiesData(BaseModel):
    """Entity data schema (for create/update)"""
    name: str
    state_id: int
    area_hectares: float = None
    main_crop: str = None


class CitiesUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    name: Optional[str] = None
    state_id: Optional[int] = None
    area_hectares: Optional[float] = None
    main_crop: Optional[str] = None


class CitiesResponse(BaseModel):
    """Entity response schema"""
    id: int
    name: str
    state_id: int
    area_hectares: Optional[float] = None
    main_crop: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CitiesListResponse(BaseModel):
    """List response schema"""
    items: List[CitiesResponse]
    total: int
    skip: int
    limit: int


class CitiesBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[CitiesData]


class CitiesBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: CitiesUpdateData


class CitiesBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[CitiesBatchUpdateItem]


class CitiesBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=CitiesListResponse)
async def query_citiess(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query citiess with filtering, sorting, and pagination"""
    logger.debug(f"Querying citiess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = CitiesService(db)
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
        logger.debug(f"Found {result['total']} citiess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying citiess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=CitiesListResponse)
async def query_citiess_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query citiess with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying citiess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = CitiesService(db)
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
        logger.debug(f"Found {result['total']} citiess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying citiess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=CitiesResponse)
async def get_cities(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single cities by ID"""
    logger.debug(f"Fetching cities with id: {id}, fields={fields}")
    
    service = CitiesService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Cities with id {id} not found")
            raise HTTPException(status_code=404, detail="Cities not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching cities {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=CitiesResponse, status_code=201)
async def create_cities(
    data: CitiesData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new cities"""
    logger.debug(f"Creating new cities with data: {data}")
    
    service = CitiesService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create cities")
        
        logger.info(f"Cities created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating cities: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating cities: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[CitiesResponse], status_code=201)
async def create_citiess_batch(
    request: CitiesBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple citiess in a single request"""
    logger.debug(f"Batch creating {len(request.items)} citiess")
    
    service = CitiesService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} citiess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[CitiesResponse])
async def update_citiess_batch(
    request: CitiesBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple citiess in a single request"""
    logger.debug(f"Batch updating {len(request.items)} citiess")
    
    service = CitiesService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} citiess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=CitiesResponse)
async def update_cities(
    id: int,
    data: CitiesUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing cities"""
    logger.debug(f"Updating cities {id} with data: {data}")

    service = CitiesService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Cities with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Cities not found")
        
        logger.info(f"Cities {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating cities {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating cities {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_citiess_batch(
    request: CitiesBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple citiess by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} citiess")
    
    service = CitiesService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} citiess successfully")
        return {"message": f"Successfully deleted {deleted_count} citiess", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_cities(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single cities by ID"""
    logger.debug(f"Deleting cities with id: {id}")
    
    service = CitiesService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Cities with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Cities not found")
        
        logger.info(f"Cities {id} deleted successfully")
        return {"message": "Cities deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting cities {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")