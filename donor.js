
document.addEventListener("DOMContentLoaded", function () {
    
    const token = localStorage.getItem('token');
    const responseMessage = document.getElementById('responseMessage');
    const trustBar = document.getElementById("trustBar");
    const sizesBox = document.getElementById("sizesBox");
    const ctx = document.getElementById('myChart');

    
    fetch('https://reqres.in/api/users?page=1')
    .then(response => response.json())
    .then(result => {
        const tableBody = document.getElementById("userdonationsTable");
        
        if (tableBody) {
           
            const limitedData = result.data.slice(0, 2); 
            
           
            const dates = ["2026-04-20", "2026-04-22"];
            const types = ["ملابس شتوية", "أحذية أطفال"];
            const sizes = ["XL", "M"];

            
            tableBody.innerHTML = limitedData.map((item, index) => `
                <tr>
                    <td>${dates[index]}</td>
                    <td>${item.id % 2 === 0 ? 'مقبول' : 'قيد الانتظار'}</td>
                    <td>${item.id + 5}</td> 
                    <td>${sizes[index]}</td>
                    <td>${types[index]}</td>
                </tr>
            `).join('');
        }
    })
    .catch(err => console.log("Table Fetch Error:", err));

    const statsData = {
        trustPercent: 82,
        categories: ['أطفال', 'حريمي', 'رجالي'],
        needsData: [15, 45, 60],
        availableSizes: [
            { name: "S", percent: 55 }, { name: "M", percent: 40 }, { name: "L", percent: 35 },
            { name: "XL", percent: 20 }, { name: "XXL", percent: 15 },
            { name: "أطفال سنتين", percent: 50 }, { name: "أطفال (5 سنوات)", percent: 55 }, { name: "أطفال (10 سنوات)", percent: 60 }
        ]
    };

    
    if (trustBar) {
        let trust = 0;
        let interval = setInterval(() => {
            if (trust >= statsData.trustPercent) {
                clearInterval(interval);
            } else {
                trust++;
                trustBar.style.width = trust + "%";
                trustBar.innerText = trust + "%";
            }
        }, 30);
    }

    
    if (sizesBox) {
        sizesBox.innerHTML = "";
        statsData.availableSizes.forEach(size => {
            let span = document.createElement("span");
            span.className = "badge bg-light text-dark border p-2 m-1";
            span.innerText = `${size.name} (${size.percent}%)`;
            sizesBox.appendChild(span);
        });
    }

    
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: statsData.categories,
                datasets: [{
                    label: 'الاحتياج',
                    data: statsData.needsData,
                    backgroundColor: ['#dc3545', '#ffc107', '#28a745']
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

window.sendDonation = async function() {
    
    const type = document.getElementById('clothingType').options[document.getElementById('clothingType').selectedIndex].text;
    const size = document.getElementById('size').options[document.getElementById('size').selectedIndex].text;
    const condition = document.getElementById('condition').options[document.getElementById('condition').selectedIndex].text;
    const quantity = document.getElementById('quantity').value;

    
    alert(
        `جاري الارسال:\n\n` + 
        `النوع: ${type}\n` +
        `المقاس: ${size}\n` +
        `الحالة: ${condition}\n` +
        `العدد: ${quantity}`
    );

    const responseMessage = document.getElementById('responseMesage'); 

    try {
        const response = await fetch('https://reqres.in/api/users', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ type, size, condition, quantity })
        });

        if (response.ok) {
            
            if (responseMessage) {
                responseMessage.style.display = "block";
                responseMessage.className = "alert alert-success py-2 mt-3";
                responseMessage.innerText = "✅ تم حفظ التبرع بنجاح!";
            }
        }
    } catch (error) {
        if (responseMessage) {
            responseMessage.style.display = "none";
        }
        console.log("Error:", error);
    }
};
});
