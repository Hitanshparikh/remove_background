let originalFileName = '';

document.getElementById('upload').addEventListener('change', previewImage);
document.getElementById('remove-bg-btn').addEventListener('click', removeBackground);
document.getElementById('download-btn').addEventListener('click', downloadImage);

function previewImage(event) {
    const originalImg = document.getElementById('original-img');
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        originalFileName = file.name; // Save the original file name and extension
        originalImg.src = URL.createObjectURL(file);
        originalImg.style.display = "block"; // Show image if a file is selected
        originalImg.onload = () => URL.revokeObjectURL(originalImg.src); // Release memory
    }
}

async function removeBackground() {
    const file = document.getElementById('upload').files[0];
    if (!file) {
        alert("Please upload an image first.");
        return;
    }

    // Show loading spinner
    document.getElementById('loading-spinner').style.display = "block";

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": "4WqQy4KuQSrCVF8ZUCknUPHD"
            },
            body: formData
        });

        if (!response.ok) throw new Error("Background removal failed");

        const blob = await response.blob();
        const resultImg = document.getElementById('result-img');
        resultImg.src = URL.createObjectURL(blob);
        resultImg.style.display = "block"; // Show result image
        document.getElementById('download-btn').style.display = "inline-block"; // Show download button
        resultImg.onload = () => URL.revokeObjectURL(resultImg.src); // Release memory
    } catch (error) {
        console.error(error);
        alert("Error removing background. Please try again.");
    } finally {
        // Hide loading spinner
        document.getElementById('loading-spinner').style.display = "none";
    }
}


function downloadImage() {
    const resultImg = document.getElementById('result-img');
    const link = document.createElement('a');
    link.href = resultImg.src;
    
    // Preserve the original filename and extension
    link.download = `background-removed-${originalFileName}`;
    
    link.click();
}
