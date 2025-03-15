// Array of 40 student names
const studentNames = [
    "Aaditi Kumari", "Aaditya Raj", "Aaditya Aadarsh", "Aditya Raushan", "Ujjwal kumar",
    "Aniket kumar", "Ansh Tiwari", "Anshika Rani", "Anshika Raj", "Anupam kumari",
    "Anuradha Priya", "Anurag kumar", "Aryan Raj", "Aryan Raja", "Atharv",
    "Atulya Bharti", "Avni kumari", "Ayush Anand", "Devanshi", "Divyanshi Shrivastava",
    "Himanshu kumar", "Jaya sharma", "Kritika kumari", "Lakshaya Thakur", "MD.Aryan",
    "MD.Shahil", "Navya Shree", "Ommne", "Paridhi", "Piyush kumar",
    "Prateek kumar viskarma", "Pratigya Raj", "Vikash kumar", "Priyanshu", "Satya",
    "Satyam kumar", "Satyam kumari", "Siddharth Shandilya", "Sonakshi", "Tanya kumari"
];

window.onload = () => {
    const studentList = document.getElementById('studentList');
    const submitBtn = document.getElementById('submitBtn');
    const attendanceType = document.getElementById('attendanceType');

    // Generate 40 students with names
    for (let i = 1; i <= 40; i++) {
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        studentItem.innerHTML = `
            <input type="checkbox" id="student${i}" value="${i}">
            <label for="student${i}">Roll No. ${i} - ${studentNames[i-1]}</label>
        `;
        studentList.appendChild(studentItem);
    }

    submitBtn.addEventListener('click', generatePDF);
}

function generatePDF() {
    try {
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
        
        // List students
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        let yPosition = 75;
        let count = 0;
        
        checkboxes.forEach((checkbox, index) => {
            // Updated logic: for absent option, list unchecked students as present
            const shouldInclude = attendanceType === 'present' 
                ? !checkbox.checked   // For present option: list unchecked as absent
                : !checkbox.checked;  // For absent option: list unchecked as present
            
            if (shouldInclude) {
                count++;
                
                if (yPosition > 270) {
                    doc.addPage();
                    doc.setFillColor(240, 240, 255);
                    doc.rect(0, 0, 220, 300, 'F');
                    yPosition = 20;
                }
                
                doc.text(`Roll No. ${index + 1} - ${studentNames[index]}`, 25, yPosition);
                yPosition += 10;
            }
        });
        
        // Total count
        if (yPosition + 20 > 270) {
            doc.addPage();
            doc.setFillColor(240, 240, 255);
            doc.rect(0, 0, 220, 300, 'F');
            yPosition = 20;
        }
        
        doc.setTextColor(0, 51, 102);
        doc.setFont("helvetica", "bold");
        doc.text(`Total ${attendanceType === 'present' ? 'Absent' : 'Present'} Students: ${count}`, 20, yPosition + 10);
        
        // Footer on all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(102, 102, 102);
            doc.setFont("helvetica", "italic");
            doc.text('Generated by: Siddharth Shandilya', 105, 285, { align: 'center' });
            doc.text('Code Motion Studios', 105, 292, { align: 'center' });
        }
        
        // Save the PDF
        const formattedDate = new Date().toLocaleDateString().replace(/\//g, '-');
        doc.save(`Attendance_${className}_${formattedDate}.pdf`);
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('Error details: ' + error.message);
    }
}
