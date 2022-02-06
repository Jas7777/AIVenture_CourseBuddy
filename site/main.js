// add courses to selector
const courseList = document.getElementById("courses-list-internal");
const courseListEntryTemplate = document.getElementById("course-list-entry");

const SUBJECT_COLOR_CLASSES = {
    "Math": "course-math",
    "Science": "course-science",
    "English": "course-english",
    "Social Science": "course-social-science",
    "World Language": "course-world-language",
    "Elective": "course-elective",
    "Arts": "course-arts",
    "Physical Education": "course-PE",
    "Health Education": "course-health",
    "Career Technical Education": "course-CTE",
    "AVID": "course-AVID"
};

for(const course of COURSES) {

    // fill in fields
    const entry = courseListEntryTemplate.content.cloneNode(true);
    entry.querySelector("h3").append(course.title);
    entry.querySelector(".course-stats").append(course.credits, " \u2022 ", course.ucCategory != "n/a" ? `Fulfills UC/CSU ${course.ucCategory.toUpperCase()} requirement` : "Does not fulfill any UC/CSU requirements");
    entry.querySelector(".course-description").append(course.description);
    entry.querySelector(".course-prereqs").append(course.prereqs);

    // assign a color
    entry.firstElementChild.classList.add(SUBJECT_COLOR_CLASSES[course.subject]);

    // add
    courseList.append(entry);

}