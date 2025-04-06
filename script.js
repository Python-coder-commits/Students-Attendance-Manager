// Array of student names
const studentNames = [
    "Aaditi kumari", "Aaditya kumar", "Aaditya Aadarsh", "Aditya Raushan", "Anant Kumar",
    "Aniket kumar", "Ansh Tiwari", "Anshika Raj", "Anshika Rani", "Anupam Kumari",
    "Anuradha Priya", "Aryan raj", "Aryan raja", "Atharva", "Atulya bharti",
    "Avni kumari", "Aylove kurmar bharti", "Ayush anand", "Ayush kumar", "Devanshi",
    "Divyanshi shrivastava", "Gunjan kumari", "Himanshu kumar", "Jaya sharma", "Kritika kumari",
    "Lakshaya raj", "MD.Aryan afroj", "MD.Shahil", "Navya shree", "Nikhil raj",
    "Omnee", "Paridhi", "Piyush kumar", "Prateek kumar", "Pratigya raj",
    "Priyanshu kumar", "Sama praveen", "Satya kumari", "Satyam kumar", "Satyam kumari",
    "Siddharth Shandilya", "Sonakshi kumari", "Tanya kumari", "Ujjwal kumar", "Vikash kumar", 
    "Uday veer", "Shahil raj"
];

// Add error handling for student list generation
window.onload = () => {
    try {
        initializeStudentList();
        initializeEventListeners();
    } catch (error) {
        console.error('Initialization Error:', error);
        alert('Failed to initialize the application');
    }
};

function initializeStudentList() {
    const studentList = document.getElementById('studentList');
    if (!studentList) throw new Error('Student list container not found');
    
    // Generate students based on array length instead of fixed 40
    for (let i = 1; i <= studentNames.length; i++) {
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        studentItem.innerHTML = `
            <input type="checkbox" id="student${i}" value="${i}">
            <label for="student${i}">Roll No. ${i} - ${studentNames[i-1]}</label>
        `;
        studentList.appendChild(studentItem);
    }
}

function initializeEventListeners() {
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) throw new Error('Submit button not found');
    
    submitBtn.addEventListener('click', generatePDF);
}

// Add form validation
function validateForm() {
    const classSelect = document.getElementById('classSelect');
    const attendanceType = document.getElementById('attendanceType');
    
    if (!classSelect.value || !attendanceType.value) {
        throw new Error('Please select both class and attendance type');
    }
}

// Modify generatePDF to use validation
function generatePDF() {
    try {
        validateForm();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Format date and time beautifully
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        
        const className = document.getElementById('classSelect').value;
        const attendanceType = document.getElementById('attendanceType').value;
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        // Add background color
        doc.setFillColor(240, 240, 255);
        doc.rect(0, 0, 220, 300, 'F');
        
        // Title
        doc.setTextColor(0, 51, 102);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(`Attendance Report`, 105, 20, { align: 'center' });
        doc.text(`Class ${className}`, 105, 30, { align: 'center' });
        
        // Decorative line
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
        
        // Enhanced date and time display
        doc.setTextColor(0, 51, 102);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Date:", 20, 45);
        doc.text("Time:", 20, 52);
        
        doc.setTextColor(51, 51, 51);
        doc.setFont("helvetica", "normal");
        doc.text(dateStr, 50, 45);
        doc.text(timeStr, 50, 52);
        
        // Add decorative elements for date/time
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(0.2);
        doc.line(20, 55, 190, 55);
        
        // List header starting position adjusted
        doc.setTextColor(153, 0, 0);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`${attendanceType === 'present' ? 'Absent' : 'Present'} Students:`, 20, 65);
        
        // List students with optimized spacing
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        let yPosition = 75;
        let count = 0;
        
        checkboxes.forEach((checkbox, index) => {
            const shouldInclude = attendanceType === 'present' 
                ? !checkbox.checked 
                : !checkbox.checked;
            
            if (shouldInclude) {
                count++;
                
                // Adjust page break threshold for better spacing
                if (yPosition > 250) {  // Changed from 270 to 250 for better page breaks
                    doc.addPage();
                    doc.setFillColor(240, 240, 255);
                    doc.rect(0, 0, 220, 300, 'F');
                    yPosition = 30;  // Changed from 20 to 30 for better top margin on new pages
                }
                
                doc.text(`Roll No. ${index + 1} - ${studentNames[index]}`, 25, yPosition);
                yPosition += 8;  // Reduced from 10 to 8 for more compact listing
            }
        });
        
        // Adjust final count position
        const finalYPosition = yPosition + (yPosition > 250 ? -yPosition + 40 : 10);
        doc.setTextColor(0, 51, 102);
        doc.setFont("helvetica", "bold");
        doc.text(`Total ${attendanceType === 'present' ? 'Absent' : 'Present'} Students: ${count}`, 20, finalYPosition);

        // Footer on all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(102, 102, 102);
            doc.setFont("helvetica", "bold");
            doc.text('<< SIDDHARTH SHANDILYA >>', 105, 285, { align: 'center' });
            doc.setFont("helvetica", "italic");
            doc.text('Beyond Design. Beyond Limits.', 105, 292, { align: 'center' });
        }
        
        // Save the PDF with date and time in filename
        const formattedDate = new Date().toLocaleDateString().replace(/\//g, '-');
        const formattedTime = new Date().toLocaleTimeString().replace(/:/g, '-').replace(' ', '_');
        doc.save(`Attendance_${className}_${formattedDate}_${formattedTime}.pdf`);
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('Error: ' + error.message);
    }
}
