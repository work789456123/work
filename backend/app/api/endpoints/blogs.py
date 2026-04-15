from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.blog import BlogResponse
from app.crud.blog import crud_blog

router = APIRouter()

@router.get("", response_model=List[BlogResponse])
async def get_blogs(db: AsyncSession = Depends(get_db)):
    return await crud_blog.get_multi(db, published_only=True)

@router.get("/{blog_id}", response_model=BlogResponse)
async def get_blog(blog_id: str, db: AsyncSession = Depends(get_db)):
    blog = await crud_blog.get(db, blog_id=blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog
