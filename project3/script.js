$(function ($) {

    /** Create Operations ======================
     *
     */
    var submitBtn = $('#add-student-btn'),
        sgtTableElement = $('#student-table'),
        firebaseRef = new Firebase("https://lfchallenge.firebaseio.com/students");

    /** Click handler to submit student information
     * Take values of the student-add-form
     */
    submitBtn.click(function () {
        var studentName = $('#s-name-input').val(),
            studentCourse = $('#s-course-input').val(),
            studentGrade = $('#s-grade-input').val();

        /** Send the values to firebase
         * firebaseRef.push will append a new item to the user list
         */
        firebaseRef.push({
            name: studentName,
            course: studentCourse,
            grade: studentGrade
        });
        clearInputs();
    });

    /** Read Operations ======================
     * Attach an asynchronous callback to read the data at our users firebaseReference on load
     * child_added will update the DOM everytime a new student is added to the data base
     */
    firebaseRef.on("child_added", function (studentSnapShot) {
        updateDOM(studentSnapShot);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    firebaseRef.on("child_changed", function (studentSnapShot) {
        updateDOM(studentSnapShot);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

       /** Update Operations ======================
     * Click handler to update student data and send to firebase
     * Get the unique id of any student
     */

    /** Edit button handler */
    sgtTableElement.on('click', '.edit-btn', function () {
        var student_id = $(this).data('id');
        var studentFirebaseRef = firebaseRef.child(student_id);

        studentFirebaseRef.once('value', function (snapshot) {
            $('#modal-edit-name').val(snapshot.val().name);
            $('#modal-edit-course').val(snapshot.val().course);
            $('#modal-edit-grade').val(snapshot.val().grade);

            $('#student-id').val(student_id);

            console.log("$('#student-id').val(student_id) : ", $('#student-id').val(student_id));

            $("#edit-modal").modal("show");
        });
    });

    /** Edit Student Function
     * studentFirebaseReference argument should be the unique url of the selected student
     */
    function studentEdit(studentFirebaseReference) {
        var newName = $('#modal-edit-name').val(),
            newCourse = $('#modal-edit-course').val(),
            newGrade = $('#modal-edit-grade').val();
        console.log('student updated', 'newName: ', newName, 'newCourse: ', newCourse, 'newGrade: ', newGrade);
        studentFirebaseReference.update({
            name: newName,
            course: newCourse,
            grade: newGrade
        });
    }

    /** Click handler for modal confirm button */
    $("#edit-modal").on('click', '#confirm-edit', function () {
        console.log("im here");
        console.log("('#edit-modal').find('#student-id').val() :", $('#edit-modal').find('#student-id').val());
        var studentFirebaseRef = firebaseRef.child($('#edit-modal').find('#student-id').val());
        /* edit form click handler */
        studentEdit(studentFirebaseRef);

        $("#edit-modal").modal('hide');
    })
    
     /** DELETE OPERATIONS ==================================
     *
     */

    /** Delete button handler */
    sgtTableElement.on('click', '.delete-btn', function () {
        var studentFirebaseRef = firebaseRef.child($(this).data('id'));
        console.log('this on delete-btn is: ' + $(this).data('id'));
        firebaseRef.on('child_removed', function (snapshot) {
            /** Remove the element from the DOM */
            console.log('snapshot.key is: ', snapshot.key());
            var rowId = snapshot.key();
            $('#' + rowId).remove();
        });
        // Delete the student with the correct firebase method
        studentFirebaseRef.remove();
    });

    /* Clear out inputs in the add-student-form      */
    function clearInputs() {
        $('#s-name-input').val('');
        $('#s-course-input').val('');
        $('#s-grade-input').val('');
    }

    /** DOM CREATION ================================== */
    function updateDOM(studentSnapShot) {
        var studentObject = studentSnapShot.val();
        var studentObjectId = studentSnapShot.key();
        var studentRow = $("#" + studentObjectId);
        if (studentRow.length > 0) {
            //change current
            studentRow.find(".student-name").text(studentObject.name);
            studentRow.find(".student-course").text(studentObject.course);
            studentRow.find(".student-grade").text(studentObject.grade);
        } else {
            //add new
            var sName = $('<td>', {
                    text: studentObject.name,
                    class: "student-name"
                }),
                sCourse = $('<td>', {
                    text: studentObject.course,
                    class: "student-course"
                }),
                sGrade = $('<td>', {
                    text: studentObject.grade,
                    class: "student-grade"
                }),
            /* Each student gets a unique edit and delete button appended to its row */
                sEditBtn = $('<button>', {
                    class: "btn btn-info edit-btn",
                    'data-id': studentObjectId
                }),
                sEditBtnIcon = $('<span>', {
                    class: "glyphicon glyphicon-pencil"
                }),
                sDeleteBtn = $('<button>', {
                    class: "btn btn-danger delete-btn",
                    'data-id': studentObjectId
                }),
                sDeleteBtnIcon = $('<span>', {
                    class: "glyphicon glyphicon-remove"
                });

            var studentRow = $('<tr>', {
                id: studentObjectId
            });
            sEditBtn.append(sEditBtnIcon);
            sDeleteBtn.append(sDeleteBtnIcon);
            studentRow.append(sName, sCourse, sGrade, sEditBtn, sDeleteBtn);
            sgtTableElement.append(studentRow);
        }
    }
});



