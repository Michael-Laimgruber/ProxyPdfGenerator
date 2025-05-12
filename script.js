// ################################################################ //
// ################### CREATE PREVIEW CELLS ####################### //
// ################################################################ //


const preview = document.getElementById('preview');

// Initial die leere Upload-Kachel hinzufügen
addEmptyCell();


function addEmptyCell() {

  // Wenn schon eine leere Kachel exisitert dann keine mehr hinzufügen
  if (document.querySelector('.preview-cell.empty')) return;

  const cell = document.createElement('div');
  cell.classList.add('preview-cell', 'empty');
  cell.innerHTML = '<span class="add-btn">+</span>';
  cell.addEventListener('click', () => handleImageUpload(cell));
  preview.appendChild(cell);
}


function handleImageUpload(cell) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;

  input.onchange = () => {
    const files = Array.from(input.files);

    // Leere Kachel entfernen
    cell.remove();

    files.forEach((file, index) => {
      const reader = new FileReader();


// ################################################################ //
// ######################## READER ONLOAD ######################### //
// ################################################################ //



      reader.onload = (e) => {
        const newCell = document.createElement('div');
        newCell.classList.add('preview-cell');
        newCell.draggable = true;

        const img = document.createElement('img');
        img.src = e.target.result;

        // Add the image to the new cell
        newCell.appendChild(img);

        // Enable drag-and-drop functionality
        enableDragAndDrop(newCell);



// ################################################################ //
// ##################### DELETE BUTTON ############################ //
// ################################################################ //



        // Add delete button to the new cell
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.onclick = () => newCell.remove();
        newCell.appendChild(deleteBtn);



// ################################################################ //
// ################### CLICK TO DUPLICATE ######################### //
// ################################################################ //



        // Enable click-to-duplicate on image
        img.addEventListener('click', () => duplicateCell(newCell));

        // Append the new cell to the preview area
        preview.appendChild(newCell);

        // Add a new empty cell at the end (only after the last image)
        if (index === files.length - 1) {
          addEmptyCell();
        }
      };

      reader.readAsDataURL(file);
    });
  };

  input.click();
}


// ################################################################ //
// ####################### UPLOAD BUTTON  ######################### //
// ################################################################ //



// Duplicate cell function (outside of the handleImageUpload function)
function duplicateCell(cell) {
  const clone = cell.cloneNode(true);
  enableDragAndDrop(clone); // make sure it’s draggable again

  // Re-bind delete button for the clone
  const deleteBtn = clone.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.onclick = () => clone.remove();
  }

  // Re-bind click-to-duplicate for the clone's image
  const img = clone.querySelector('img');
  if (img) {
    img.addEventListener('click', () => duplicateCell(clone));
  }

  // Insert the clone right after the original cell
  preview.insertBefore(clone, cell.nextSibling);
}


let draggedElement = null;




// ################################################################ //
// ################### DRAG AND DROP FOR CELLS #################### //
// ################################################################ //



function enableDragAndDrop(cell) {
  cell.draggable = true;



cell.addEventListener('dragstart', (e) => {
  draggedElement = cell;
  cell.classList.add('dragging');

  const img = cell.querySelector('img');
  if (img) {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 140;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    e.dataTransfer.setDragImage(canvas, canvas.width / 2, canvas.height / 2);
  }
}); 



cell.addEventListener('dragend', () => {
  draggedElement = null;
  const allCells = document.querySelectorAll('.preview-cell');
  allCells.forEach(c => {
    c.classList.remove('drop-target');
    c.classList.remove('dragging');
  });
});


   
cell.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (cell !== draggedElement) {
    cell.classList.add('drop-target');
  }
});

 

cell.addEventListener('dragleave', () => {
  cell.classList.remove('drop-target');
});



cell.addEventListener('drop', (e) => {
  e.preventDefault();
  if (!draggedElement || cell === draggedElement) return;

  const all = Array.from(preview.children);
  const draggedIndex = all.indexOf(draggedElement);
  const targetIndex = all.indexOf(cell);

  if (targetIndex > draggedIndex) {
    preview.insertBefore(draggedElement, cell.nextSibling);
  } 
  else {
    preview.insertBefore(draggedElement, cell);
  }
});
}



// ################################################################ //
// ###################### UPLOAD BUTTON ########################### //
// ################################################################ //




document.getElementById('button_upload').addEventListener('click', triggerFileInput);

function triggerFileInput() {
  // Erstelle ein unsichtbares Input-Element für die Datei-Auswahl
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;  // Mehrere Bilder erlauben

  // Wenn Dateien ausgewählt werden, werden sie verarbeitet
  input.onchange = () => {
    const files = Array.from(input.files);

    files.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const newCell = document.createElement('div');
        newCell.classList.add('preview-cell');
        newCell.draggable = true;

        const img = document.createElement('img');
        img.src = e.target.result;

        // Bild in die neue Zelle einfügen
        newCell.appendChild(img);

        // Drag-and-Drop aktivieren
        enableDragAndDrop(newCell);

        // Löschen-Button hinzufügen
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.onclick = () => newCell.remove();
        newCell.appendChild(deleteBtn);

        // Zelle duplizieren
        img.addEventListener('click', () => duplicateCell(newCell));

        // Neue Zelle hinzufügen
        preview.appendChild(newCell);

        // Nach dem Hinzufügen des Bildes eine neue leere Zelle hinzufügen
        if (index === files.length - 1) {
          addEmptyCell();  // Füge nach der letzten Zelle immer die leere Zelle hinzu
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // Das unsichtbare Input-Element wird ausgelöst, um den Dateiauswahldialog zu öffnen
  input.click();
}






// ################################################################ //
// ###################### EXPORT TO PDF ########################### //
// ################################################################ //




// ########################## BUTTON ############################## //

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('button_export').addEventListener('click', exportAsPDF);
});

// ###################### EXPORT FUNCTION ######################### //

document.getElementById('button_export').addEventListener('click', exportAsPDF);

function exportAsPDF() {
  const images = Array.from(document.querySelectorAll('.preview-cell:not(.empty) img'))
    .filter(img => img.complete && img.naturalWidth > 0);

  if (images.length === 0) {
    alert("Keine Bilder zum Exportieren.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

  const cardWidth = 63;
  const cardHeight = 88;
  const pageWidth = 210;
  const pageHeight = 297;

  const marginX = (pageWidth - 3 * cardWidth) / 2;  // Center grid horizontally
  const marginY = (pageHeight - 3 * cardHeight) / 2; // Center grid vertically

  let x = 0, y = 0, imgCount = 0;

  images.forEach((img, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0); // Full quality

    const posX = marginX + (x * cardWidth);
    const posY = marginY + (y * cardHeight);

    
    pdf.addImage(dataUrl, 'JPEG', posX, posY, cardWidth, cardHeight);

    // Add crop marks (thin lines across the top/bottom/left/right of each card)
    drawCropMarks(pdf, posX, posY, cardWidth, cardHeight);

    x++;
    if (x === 3) {
      x = 0;
      y++;
    }
    if (y === 3 && i < images.length - 1) {
      pdf.addPage();
      x = 0;
      y = 0;
    }
  });

  pdf.save('mtg_proxy_pdf_print.pdf');
}

// ###################### CROP MARKS ######################### //

function drawCropMarks(pdf) {
  const pageWidth = 210;
  const pageHeight = 297;
  const lineWidth = 0.05;
  pdf.setLineWidth(lineWidth);

  // Vertical crop lines (x-positions)
  const xPositions = [10.5, 73.5, 136.5, 199.5];
  xPositions.forEach(x => {
    pdf.line(x, 0, x, pageHeight);
  });

  // Horizontal crop lines (y-positions)
  const yPositions = [16.5, 104.5, 192.5, 280.5];
  yPositions.forEach(y => {
    pdf.line(0, y, pageWidth, y);
  });

  // Draw small white crosses at intersections (4 mm total length, 2 mm each direction)
  const crossHalfLength = 1; // 1 mm each side of center
  pdf.setDrawColor(255);     // White color for the cross

  xPositions.forEach(x => {
    yPositions.forEach(y => {
      // Horizontal part of cross
      pdf.line(x - crossHalfLength, y, x + crossHalfLength, y);
      // Vertical part of cross
      pdf.line(x, y - crossHalfLength, x, y + crossHalfLength);
    });
  });

  // Restore black for further drawing
  pdf.setDrawColor(0);
}



// ############### REGISTRATION MARKS CUTTER PLOTTER TOGGLE ######################### //

function drawRegistrationMarks(pdf) {
  const markSize = 5; // Size of the square (in mm)
  const offset = 3;   // Distance from the page edge

  // Top-left
  pdf.rect(offset, offset, markSize, markSize);

  // Top-right
  pdf.rect(210 - offset - markSize, offset, markSize, markSize);

  // Bottom-left
  pdf.rect(offset, 297 - offset - markSize, markSize, markSize);

  // Bottom-right
  pdf.rect(210 - offset - markSize, 297 - offset - markSize, markSize, markSize);
}
