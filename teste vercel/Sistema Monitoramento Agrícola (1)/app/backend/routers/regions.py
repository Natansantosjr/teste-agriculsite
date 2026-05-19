import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.regions import RegionsService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/regions", tags=["regions"])


# ---------- Pydantic Schemas ----------
class RegionsData(BaseModel):
    """Entity data schema (for create/update)"""
    name: str
    code: str


class RegionsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    name: Optional[str] = None
    code: Optional[str] = None


class RegionsResponse(BaseModel):
    """Entity response schema"""
    id: int
    name: str
    code: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RegionsListResponse(BaseModel):
    """List response schema"""
    items: List[RegionsResponse]
    total: int
    skip: int
    limit: int


class RegionsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[RegionsData]


class RegionsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: RegionsUpdateData


class RegionsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[RegionsBatchUpdateItem]


class RegionsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=RegionsListResponse)
async def query_regionss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query regionss with filtering, sorting, and pagination"""
    logger.debug(f"Querying regionss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = RegionsService(db)
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
        logger.debug(f"Found {result['total']} regionss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying regionss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=RegionsListResponse)
async def query_regionss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query regionss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying regionss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = RegionsService(db)
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
        logger.debug(f"Found {result['total']} regionss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying regionss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=RegionsResponse)
async def get_regions(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single regions by ID"""
    logger.debug(f"Fetching regions with id: {id}, fields={fields}")
    
    service = RegionsService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Regions with id {id} not found")
            raise HTTPException(status_code=404, detail="Regions not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching regions {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=RegionsResponse, status_code=201)
async def create_regions(
    data: RegionsData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new regions"""
    logger.debug(f"Creating new regions with data: {data}")
    
    service = RegionsService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create regions")
        
        logger.info(f"Regions created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating regions: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating regions: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[RegionsResponse], status_code=201)
async def create_regionss_batch(
    request: RegionsBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple regionss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} regionss")
    
    service = RegionsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} regionss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[RegionsResponse])
async def update_regionss_batch(
    request: RegionsBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple regionss in a single request"""
    logger.debug(f"Batch updating {len(request.items)} regionss")
    
    service = RegionsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} regionss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=RegionsResponse)
async def update_regions(
    id: int,
    data: RegionsUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing regions"""
    logger.debug(f"Updating regions {id} with data: {data}")

    service = RegionsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Regions with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Regions not found")
        
        logger.info(f"Regions {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating regions {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating regions {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_regionss_batch(
    request: RegionsBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple regionss by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} regionss")
    
    service = RegionsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} regionss successfully")
        return {"message": f"Successfully deleted {deleted_count} regionss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_regions(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single regions by ID"""
    logger.debug(f"Deleting regions with id: {id}")
    
    service = RegionsService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Regions with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Regions not found")
        
        logger.info(f"Regions {id} deleted successfully")
        return {"message": "Regions deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting regions {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")