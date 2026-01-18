from app.models.timetable import Timetable
from app.models.availability import FacultyAvailability

def is_faculty_available(db, faculty_id, timeslot_id):
    record = db.query(FacultyAvailability).filter_by(
        faculty_id=faculty_id,
        timeslot_id=timeslot_id,
        is_available=True
    ).first()
    return record is not None


def generate_timetable(db, sections, courses, faculties, rooms, timeslots):
    timetable_entries = []

    for section in sections:
        for course in courses:
            assigned = False

            for timeslot in timeslots:
                for faculty in faculties:
                    if not is_faculty_available(db, faculty.id, timeslot.id):
                        continue

                    for room in rooms:
                        # HARD CONSTRAINTS
                        if room.capacity < section.student_count:
                            continue

                        if room.room_type != course.course_type:
                            continue

                        # CHECK CLASHES
                        clash = db.query(Timetable).filter_by(
                            faculty_id=faculty.id,
                            timeslot_id=timeslot.id
                        ).first()

                        if clash:
                            continue

                        entry = Timetable(
                            section_id=section.id,
                            course_id=course.id,
                            faculty_id=faculty.id,
                            room_id=room.id,
                            timeslot_id=timeslot.id
                        )

                        db.add(entry)
                        db.commit()

                        timetable_entries.append(entry)
                        assigned = True
                        break

                    if assigned:
                        break
                if assigned:
                    break

            if not assigned:
                raise Exception(f"No feasible slot for course {course.name}")

    return timetable_entries
