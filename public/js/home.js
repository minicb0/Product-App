var txt = document.getElementById('droptxt'),
    content = document.getElementById('content'),
    noProduct = document.getElementById('noProduct'),
    search = document.getElementById('search'),
    list = document.querySelectorAll('.content input[type="checkbox"]'),
    price = document.querySelectorAll('.price'),
    inputNumberDecrement = document.querySelectorAll('.input-number-decrement'),
    quantity = document.querySelectorAll('.quantity'),
    productLabel = document.querySelectorAll('.productLabel'),
    allProducts = document.querySelectorAll('.allProducts'),
    productGroup = document.querySelectorAll('.productGroup'),
    inputNumberIncrement = document.querySelectorAll('.input-number-increment');

txt.addEventListener('click', function () {
    content.classList.toggle('show')
})

// Close the dropdown if the user clicks outside of it
window.onclick = function (e) {
    if (!e.target.matches('.list')) {
        if (content.classList.contains('show')) {
            content.classList.remove('show')
        }
    }
    if(e.target.matches('.list')) {
        if (!content.classList.contains('show')) {
            content.classList.add('show')
            // txt.focus();
        }
    }
    if(e.target.matches('.input-number-decrement')) {
        if (!content.classList.contains('show')) {
            content.classList.add('show')
            // txt.focus();
        }
    }
    if(e.target.matches('.input-number-increment')) {
        if (!content.classList.contains('show')) {
            content.classList.add('show')
        }
    }
    if(e.target.matches('.search')) {
        if (!content.classList.contains('show')) {
            content.classList.add('show')
        }
    }
}

list.forEach(function (item, index) {
    item.addEventListener('click', function () {
        txt.oninvalid = true;
        if (item.checked) {
            inputNumberDecrement[index].classList.remove('hidden');
            inputNumberIncrement[index].classList.remove('hidden');
        } else {
            inputNumberDecrement[index].classList.add('hidden');
            inputNumberIncrement[index].classList.add('hidden');
        }
        
        quantity[index].type = (item.checked) ? 'number' : 'hidden';
        calc()
    })

})

productLabel.forEach(function (item, index) {
    item.addEventListener('click', function () {
        
        if (list[index].checked) {
            list[index].checked = false;
            inputNumberDecrement[index].classList.add('hidden');
            inputNumberIncrement[index].classList.add('hidden');
        } else {
            list[index].checked = true;
            inputNumberDecrement[index].classList.remove('hidden');
            inputNumberIncrement[index].classList.remove('hidden');
        }
        
        quantity[index].type = (list[index].checked) ? 'number' : 'hidden';
        calc()
    })

})

inputNumberDecrement.forEach(function (item, index) {
    item.addEventListener('click', () => {
        // txt.focus();
        if (parseInt(quantity[index].value) > 1) {
            content.classList.add('show')
            quantity[index].value = parseInt(quantity[index].value) - 1;
            calc();
            content.classList.add('show')
        }
    })
})

inputNumberIncrement.forEach(function (item, index) {
    item.addEventListener('click', () => {
        // txt.focus();
        // if (parseInt(quantity[index].value) > 1) {
            content.classList.add('show')
            quantity[index].value = parseInt(quantity[index].value) + 1;
            calc();
            content.classList.add('show')
        // }
    })

})

quantity.forEach(function (item) {
    item.addEventListener('input', calc)
})

// price.forEach(function (item) {
//     item.addEventListener('input', calc)
// })

function calc() {
    for (var i = 0, arr = []; i < list.length; i++) {
        var text = list[i].parentElement.children[1].textContent;
        if (list[i].checked) arr.push(quantity[i].value + ' x ' + text )
    }
    // console.log(arr)
    txt.value = arr.join(', ')
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    // div = document.getElementById("myDropdown");
    // a = div.getElementsByTagName("a");
    var count = 0
    for (i = 0; i < productLabel.length; i++) {
    //   console.log(productLabel[i].textContent)
      txtValue = productLabel[i].textContent.toUpperCase();
 

      if (!txtValue.includes(filter)) {
        productGroup[i].style.display = "none";
      } else {
        productGroup[i].style.display = "block";
        count++;
      } 

    }
    if(count == 0) {
        noProduct.style.display = "block";
    } else {
        noProduct.style.display = "none";
    }
  }