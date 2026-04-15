from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.blog import Blog
from app.schemas.blog import BlogCreate

class CRUDBlog:
    async def create(self, db: AsyncSession, blog_in: BlogCreate) -> Blog:
        db_obj = Blog(
            title=blog_in.title,
            description=blog_in.description,
            content=blog_in.content,
            cover_image_url=blog_in.cover_image_url,
            published=blog_in.published
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def get_multi(self, db: AsyncSession, published_only: bool = False) -> List[Blog]:
        query = select(Blog)
        if published_only:
            query = query.where(Blog.published == True)
        result = await db.execute(query.order_by(Blog.created_at.desc()))
        return list(result.scalars().all())
        
    async def get(self, db: AsyncSession, blog_id: str) -> Blog | None:
        result = await db.execute(select(Blog).where(Blog.id == blog_id))
        return result.scalars().first()

crud_blog = CRUDBlog()
