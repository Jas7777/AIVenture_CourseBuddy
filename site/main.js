// add courses to selector
const courseList = document.getElementById("courses-list-internal");
const courseListEntryTemplate = document.getElementById("course-list-entry");

for(const course of COURSES) {
    const entry = courseListEntryTemplate.content.cloneNode(true);
    entry.querySelector("h3").append(course.title);
    entry.querySelector(".course-stats").append();
    entry.querySelector(".course-description").append(course.description);
    entry.querySelector(".course-prereqs").append(course.prereqs);
    courseList.append(entry);
}