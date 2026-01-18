from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.generator import generate_timetable
from app.models import faculty, course, section, room, timeslot

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/generate")
def generate(db: Session = Depends(get_db)):
    return generate_timetable(
        db,
        db.query(section.Section).all(),
        db.query(course.Course).all(),
        db.query(faculty.Faculty).all(),
        db.query(room.Room).all(),
        db.query(timeslot.TimeSlot).all()
    )
