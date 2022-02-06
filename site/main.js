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
    
    // add link
    entry.querySelector("a").addEventListener("click", () => {

    });

    // add
    course.element = entry.querySelector(".course-list-entry");
    courseList.append(entry);

}

// update filters
const schoolFilter = document.getElementById("filter-school"),
      gradeLevelFilter = document.getElementById("filter-grade-level"),
      subjectAreaFilter = document.getElementById("filter-subject-area"),
      ucReqsFilter = document.getElementById("filter-uc-req");

const refreshFilters = () => {
    
    const school = schoolFilter.querySelector(":checked").value;
    const grades = [...gradeLevelFilter.querySelectorAll(":checked")].map(node => node.value);
    const subjects = [...subjectAreaFilter.querySelectorAll(":checked")].map(node => node.value);
    const ucReqs = [...ucReqsFilter.querySelectorAll(":checked")].map(node => node.value);

    let courses = COURSES.filter(course => course.schools.includes(school));
    
    if(grades.length > 0) courses = courses.filter(course => {
        for(const grade of grades) {
            if(course.gradesAvailable.includes(Number(grade))) return true;
        }
    });

    console.log(subjects);
    if(subjects.length > 0) courses = courses.filter(course => subjects.includes(course.subject));
    if(ucReqs.length > 0) courses = courses.filter(course => ucReqs.includes(course.ucCategory));

    for(const course of COURSES) {
        course.element.style.display = courses.includes(course) ? "" : "none";
    }

    document.getElementById("courses-count").textContent = `Courses (${courses.length})`;

};

// attach event listeners for filters
schoolFilter.querySelectorAll("input").forEach(node => node.addEventListener("input", refreshFilters));
gradeLevelFilter.querySelectorAll("input").forEach(node => node.addEventListener("input", refreshFilters));
subjectAreaFilter.querySelectorAll("input").forEach(node => node.addEventListener("input", refreshFilters));
ucReqsFilter.querySelectorAll("input").forEach(node => node.addEventListener("input", refreshFilters));
refreshFilters();

const modalLayer = document.getElementById("modal-layer");
document.getElementById("modal-close").addEventListener("click", () => modalLayer.style.display = "none");
