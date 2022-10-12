const dataform=$('#dataform');
const listItems=$('#listItems');

//Insert the Records in the Offers Table
function addRec(doc){

    listItems.append(`<tr id="${doc.id}">    
      <td>${doc.data().brand}</td>
      <td>${doc.data().price}</td>
      <td>${doc.data().location}</td>  
      <td>${doc.data().description}</td>  
      <td>${doc.data().category}</td>

      <td align="center" width="100"><a href="javascript:void(0)" class="btn btn-warning edit" onclick="editRec()" id="${doc.id}"><i class="far fa-edit"></i> EDIT</a></td>
      <td align="center" width="100"><a href="javascript:void(0)" class="btn btn-danger delete" onclick="delRec()" id="${doc.id}"><i class="far fa-trash-alt"></i> DELETE</a></td>
      </tr>`);

    //DynaTable JQuery for Table Functions
    $(document).ready(function() {
      $('#print').dynatable();
  } ); 
    
}

//Delete the Records in the Offers Collection in Firestore 
function delRec(doc){
  $('.delete').click((e)=>{
    e.stopImmediatePropagation();
    var id=e.target.id;

    db.collection('offers').doc(id).delete();

    swal("Oh no!", "A data was deleted!", "warning");
  })
}

//Edit Trigger Function in the Offers Table
function editRec(doc){
  $('.edit').click((e)=>{
    e.stopImmediatePropagation();
    var id=e.target.id;

    db.collection('offers').doc(id).get().then(doc=>{

        $('#brand').val(doc.data().brand);
        $('#price').val(doc.data().price);
        $('#location').val(doc.data().location);
        $('#description').val(doc.data().description);
        $('#category').val(doc.data().category);
        $('#document').val(doc.id);

    })
  })
}

//Update Records in the Offers Collection in Firestore
function updateRec(doc){
  $('.update').click((e)=>{
      var id = $('#document').val();

      db.collection('offers').doc(id).set({
          brand:$('#brand').val(),
          price:$('#price').val(),
          location:$('#location').val(),
          description:$('#description').val(),
          category:$('#category').val(),
        
  }, {merge:true})

      $('#brand').val('');
      $('#price').val('');
      $('#location').val('');
      $('#description').val('');
      $('#category').val('');

      swal("Yay!", "A data was edited!", "success");
  })
}

//Add Records in the Offers Collection in Firestore
dataform.on('submit',(e)=> {
   e.preventDefault();
   
   db.collection('offers').add({
       brand:$('#brand').val(),
        price:$('#price').val(),
       location:$('#location').val(),
        description:$('#description').val(),
        category:$('#category').val(),

    })

    $('#brand').val('');
    $('#price').val('');
    $('#location').val('');
    $('#description').val('');
    $('#category').val('');
    
    swal("Yay!", "A data was added!", "success");
})

//Other Functions
db.collection('offers').onSnapshot(snapshot=>{
    let changes=snapshot.docChanges();
    changes.forEach(change=>{
        if(change.type=="added"){
            addRec(change.doc)
        }
        else if(change.type=="removed"){
            var id=change.doc.id;
            $('#'+id).remove();
        }
        else if(change.type=="modified"){
            var id=change.doc.id;
            $('#'+id).remove();
            addRec(change.doc);
        }
    })
})


//Export as PDF
function generate() {  
    var doc = new jsPDF('p', 'pt', 'letter');  
    var htmlstring = '';  
    var tempVarToCheckPageHeight = 0;  
    var pageHeight = 0;  
    pageHeight = doc.internal.pageSize.height;  
    specialElementHandlers = {  
        // element with id of "bypass" - jQuery style selector  
        '#bypassme': function(element, renderer) {  
            // true = "handled elsewhere, bypass text extraction"  
            return true  
        }  
    };  
    margins = {  
        top: 150,  
        bottom: 60,  
        left: 40,  
        right: 40,  
        width: 600  
    };  
    var y = 30;  
    doc.setLineWidth(2);  
    doc.text(200, y = y + 30, "         OFFERS TABLE");
    
    doc.autoTable({  
        html: '#print',  
        startY: 70,  
        theme: 'grid',  
        columnStyles: {  
            0: {  
                cellWidth: 50,  
            },  
            1: {  
                cellWidth: 50,  
            },  
            2: {  
                cellWidth: 50,  
            } ,
            
            
        },  
        styles: {  
            minCellHeight: 40  
        }  
    })  
    doc.save('OFFERS.pdf');  
}  



// Export as Excel
  function exportToExcel(tableID, filename = ''){
      var downloadurl;
      var dataFileType = 'application/vnd.ms-excel';
      var tableSelect = document.getElementById(tableID);
      var tableHTMLData = tableSelect.outerHTML.replace(/ /g, '%20');
      
      // Specify file name
      filename = filename?filename+'.xls':'export_excel_data.xls';
      
      // Create download link element
      downloadurl = document.createElement("a");
      
      document.body.appendChild(downloadurl);
      
      if(navigator.msSaveOrOpenBlob){
          var blob = new Blob(['\ufeff', tableHTMLData], {
              type: dataFileType
          });
          navigator.msSaveOrOpenBlob( blob, filename);
      }else{
          // Create a link to the file
          downloadurl.href = 'data:' + dataFileType + ', ' + tableHTMLData;
      
          // Setting the file name
          downloadurl.download = filename;
          
          //triggering the function
          downloadurl.click();
      }
  }

//Export as CSV
  $('#export').click(function() {
      var titles = [];
      var data = [];
    
      /*
       * Get the table headers, this will be CSV headers
       * The count of headers will be CSV string separator
       */
      $('#print th').each(function() {
        titles.push($(this).text());
      });
    
      /*
       * Get the actual data, this will contain all the data, in 1 array
       */
      $('#print td').each(function() {
        data.push($(this).text());
      });
      
      /*
       * Convert our data to CSV string
       */
      var CSVString = prepCSVRow(titles, titles.length, '');
      CSVString = prepCSVRow(data, titles.length, CSVString);
    
      /*
       * Make CSV downloadable
       */
      var downloadLink = document.createElement("a");
      var blob = new Blob(["\ufeff", CSVString]);
      var url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "OFFERS.csv";
    
      /*
       * Actually download CSV
       */
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
    
       /*
    * Convert data array to CSV string
    * @param arr {Array} - the actual data
    * @param columnCount {Number} - the amount to split the data into columns
    * @param initial {String} - initial string to append to CSV string
    * return {String} - ready CSV string
    */
    function prepCSVRow(arr, columnCount, initial) {
      var row = ''; // this will hold data
      var delimeter = ','; // data slice separator, in excel it's `;`, in usual CSv it's `,`
      var newLine = '\r\n'; // newline separator for CSV row
    
      /*
       * Convert [1,2,3,4] into [[1,2], [3,4]] while count is 2
       * @param _arr {Array} - the actual array to split
       * @param _count {Number} - the amount to split
       * return {Array} - splitted array
       */
      function splitArray(_arr, _count) {
        var splitted = [];
        var result = [];
        _arr.forEach(function(item, idx) {
          if ((idx + 1) % _count === 0) {
            splitted.push(item);
            result.push(splitted);
            splitted = [];
          } else {
            splitted.push(item);
          }
        });
        return result;
      }
      var plainArr = splitArray(arr, columnCount);
      // don't know how to explain this
      // you just have to like follow the code
      // and you understand, it's pretty simple
      // it converts `['a', 'b', 'c']` to `a,b,c` string
      plainArr.forEach(function(arrItem) {
        arrItem.forEach(function(item, idx) {
          row += item + ((idx + 1) === arrItem.length ? '' : delimeter);
        });
        row += newLine;
      });
      return initial + row;
    }


