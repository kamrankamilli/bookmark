function firebaseSetup(){
  var firebaseConfig = {
    apiKey: "AIzaSyBR4-yAbjUfWzohX1OwSRoQrNGXMggalYk",
    authDomain: "bookmark-app-100.firebaseapp.com",
    databaseURL: "https://bookmark-app-100.firebaseio.com",
    projectId: "bookmark-app-100",
    storageBucket: "bookmark-app-100.appspot.com",
    messagingSenderId: "646115083314",
    appId: "1:646115083314:web:10239ecdf80eb8af03a82b",
    measurementId: "G-SCD66NGJ8T"
  };
firebase.initializeApp(firebaseConfig);

}

$(document).ready(function(){

$('.goTo').each(function(){
  $(this).click(function(e){
    e.preventDefault();
    $this = $(this);
    target = $this.data('target');

    $('.loginPage').each(function(){
      $(this).css('display','none');
    });
$('#'+target).css('display','block');

  });
});

$('.addButton').click(function(){
  $('.dropoutMenu').css('display','block');
  $('.dropoutMenu').animate({
    'height':'98px'
  },500,function(){});

});

$('.addItem').each(function(){

$(this).click(function(){
  $this = $(this);
  $('.addBookBox').each(function(){
    $(this).css('display','none');
  });
  target = $this.data('target');
  if(target){
  $('#'+target).css('display','block');
  $('.add').css('display','block');
  $('.add').animate({
    'opacity':'1'
  },500,function(){});
}
});
});
$('.container-fluid').click(function(){
  if($('.add').css('opacity') == 1) {
    $('.add').animate({
      'opacity':'0'
    },500,function(){$('.add').css('display','none');});

  }
  if($('.dropoutMenu').css('height') == '98px'){

    $('.dropoutMenu').animate({
      'height':'0'
    },500,function(){$('.dropoutMenu').css('display','none');});
  }
});
$('.loginBox').click(function(e){
  e.stopPropagation();
});
// $('.delBox').each(function(){
//   $(this).click(function(e){
//     e.preventDefault();
//     $(this).parent().parent().parent().remove();
//   });
// });

$('.addSubmit').each(function(){
  $(this).click(function(e){
    e.preventDefault();
    $this = $(this);
    if($(this).data('type') == 'cat'){
      $name = $this.parent().find('input[name="name"]').val();
      const db = firebase.database().ref();
      const user = db.child('users/'+sessionStorage.userId);
      user.once('value',(snap)=>{
        const userData = snap.val();
        userData.categories[$name] = "";
        user.set(userData);
      });
    }else{
      if(sessionStorage.currentCategory){
        sessionStorage.editedCategory = sessionStorage.currentCategory;
        $name = $this.parent().find('input[name="name"]').val();
        $url = $this.parent().find('input[name="url"]').val();
        if($url.substring(0, 4) !== 'http'){$url = 'http://'+$url;}
        const db = firebase.database().ref();
        const user = db.child('users/'+sessionStorage.userId+'/categories/'+sessionStorage.currentCategory);
        user.push().set({
  name: $name,
  url: $url
});

goToCat();
      }else{
      $name = $this.parent().find('input[name="name"]').val();
      $url = $this.parent().find('input[name="url"]').val();
      if($url.substring(0, 4) !== 'http'){$url = 'http://'+$url;}
      const db = firebase.database().ref();
      const user = db.child('users/'+sessionStorage.userId);
      user.once('value',(snap)=>{
        const userData = snap.val();
        userData.bookmarks[$name] = $url;
        user.set(userData);
      });
    }
    }
    $('.add').animate({
      'opacity':'0'
    },500,function(){$('.add').css('display','none');});
    $('.delBox').each(function(){
      $(this).click(function(e){
        e.preventDefault();
        $buttonBox = $(this);
        remove($buttonBox);

      });
    });
    goToCat()
    $(".bookmarkUrl").each(function() {
        $(this).parent().prev().attr('src',"//favicon.yandex.net/favicon/" + getDomain($(this).text()));
    });
  });

});

$('.searchBar').on('input',function(){
  if($('.searchBar').val().length > 1){
    $key = $(this).val();
    $('.mList').children().css('display','none');
    $('.searchEl').each(function(){
      $this = $(this);
      if ($(this).text().toLowerCase().indexOf($key) >= 0){
        if($(this).parent().parent().parent().hasClass('bookmarkBox')){
          $this.parent().parent().parent().parent().css('display','block');
        }else{
        $this.parent().parent().parent().css('display','block');
      }
      }
    });
  }else{
    $('.mList').children().css('display','block');
  }
});



$(".bookmarkUrl").each(function() {
    $(this).parent().prev().attr('src',"//favicon.yandex.net/favicon/" + getDomain($(this).text()));
});



$('#loginButton').click(function(e){
  firebaseSetup();
  const db = firebase.database().ref();
  const users = db.child('users');
  e.preventDefault();
  $attempt = $(this).parent();
  $user = {};
  email = $attempt.find('input[name="email"]').val();
  password = $attempt.find('input[name="password"]').val();

  users.on('value', (snap) => {
    let usersObj = snap.val();

    for (let [key, value] of Object.entries(usersObj)) {


    if(value.email == email){
      if(value.password == password){
        sessionStorage.login = true;
        sessionStorage.userId = key;
        sessionStorage.userEmail = value.email;
        sessionStorage.userName = value.fullname;

      }
    }
  }
  });
setTimeout(function(){


  if(sessionStorage.login == 'true'){
      window.location.href="index.html";
  }else{
    $('.loginError').text("Wrong Email Or Password. Try Again");
  }

},1000);

});

$('#registerButton').click(function(e){
  e.preventDefault();
  firebaseSetup();
  const db = firebase.database().ref();
  const users = db.child('users');
  $this = $(this);
  users.once('value', (snap) => { var totalUsers = snap.numChildren();
    newUser = {};
    $('#registerButton').parent().find('.loginInput').each(function(){
      key = $(this).attr('name');
      value = $(this).val();
      newUser[key] = value;
    });


  firebase.database().ref('users/'+ totalUsers).set(newUser, function(){
  });
});
$('.addBookBox').each(function(){
  $(this).css('display','none');
});
target = $this.data('target');
$('#'+target).css('display','block');
});

$('.user').click(function(){
  window.sessionStorage.login = 'false';
})


});


function getDomain(url) {
   return url.match(/:\/\/(.[^/]+)/)[1];
}




function bookmarks(nosetup) {

  if(nosetup == 1){


}else{
  firebaseSetup();
}
// if(sessionStorage.editedCategory){
//   setTimeout(function(){
// $('.categoryName').each(function(){
//   if($(this).text() == sessionStorage.editedCategory){
//     $this = $(this);
//     sessionStorage.removeItem('editedCategory');
//
//
//
//     $this.parent().click();
//
//   }
// });
// },1000);
// sessionStorage.removeItem('currentCategory');
// }
const db = firebase.database().ref();
const user = db.child('users/' + sessionStorage.userId);

user.on('value', (snap)=>{
  currentUser = snap.val();
  $bookmarks = currentUser.bookmarks;
  $categories = currentUser.categories;
  $('.mList div').each(function(){
    $(this).remove();
  });
  if(Object.keys($bookmarks).length){
$.each($bookmarks, function(key,value){
  $('.mList').append(`<div class="col-12 col-md-6 col-lg-3">
    <a href="`+value+`" target="_blank" class="bookmarkBox">
  <div class="bookmark">
    <div class="delBox">
      <img class="del" src="/images/del.png"/>
    </div>
    <img class="bookmarkIcon" src="//favicon.yandex.net/favicon/` + getDomain(value) +`"/>
    <div class="bookmarkNameBox">
      <p class="bookmarkName searchEl">`+key+`</p>
      <p class="bookmarkUrl searchEl">`+value+`</p>
      </div>
    </div>
    </a>
    </div>`);
});
}
if(Object.keys($categories).length > 0){
$.each($categories, function(key,value){
  $cat1 = `<div class="col-12 col-md-6 col-lg-3">
    <a class="categoryBox">
  <div class="category"> `;
  $cat2 = `<div class="delBox">
      <img class="del" src="/images/del.png"/>
    </div>
    <h3 class="categoryName searchEl">`+key+`</h3>
    <img class="categoryIcon" src="/images/folder.png"/>
    </div>
    </a>
    </div>`;
    $.each(value, function(id,val){
      $input = '<input class="subBooks" type="hidden" data-id="'+id+'" data-name="'+val["name"]+'" data-url="'+val["url"]+'"/>';
      $cat1 = $cat1.concat($input);
    });
    $cat1 = $cat1.concat($cat2);
  $('.mList').append($cat1);
});
}
$('.delBox').each(function(){
  $(this).click(function(e){
    e.preventDefault();
    $buttonBox = $(this);
    remove($buttonBox);
  });
});
goToCat()
});

}

function remove(block){
  if(block.parent().hasClass('bookmark')){

  target = block.parent().find('.bookmarkNameBox .bookmarkName').text();

  const db = firebase.database().ref();
  const user = db.child('users/'+sessionStorage.userId);
  user.once('value',(snap)=>{
    const userData = snap.val();
    delete userData.bookmarks[target];
    user.set(userData);
  });
}else if(block.parent().hasClass('category')) {
target = block.parent().find('.categoryName').text();
const db = firebase.database().ref();
const user = db.child('users/'+sessionStorage.userId);
user.once('value',(snap)=>{
  const userData = snap.val();
  delete userData.categories[target];
  user.set(userData);

});

}else{

        targetCat = block.parent().find('input').eq(0).val();
        target = block.parent().find('input').eq(1).val();
        const db = firebase.database().ref();
        const user = db.child('users/'+sessionStorage.userId);
        user.once('value',(snap)=>{
          const userData = snap.val();

if(Object.keys(userData.categories[targetCat]).length > 1){
  console.log('more than one book, change the function to escape from mutating..');
  // $index = userData.categories[targetCat].indexOf(target);
  // console.log('index of book:'+$index);
          // userData.categories[targetCat].splice($index,1);
        }else{
          console.log('only book');
          // userData.categories[targetCat] = [];
        }
          // user.set(userData);

        });
}
}

function goToCat(){

  // if(sessionStorage.editedCategory){
  //   catName = sessionStorage.editedCategory;
  //   setTimeout(function(){
  //     $('.categories').each(function(){
  //       if($(this).find('.categoryName').text() == catName){
  //         $this = $(this);
  //       }
  //     });
  //
  //   $subBooks = $this.find('.category .subBooks');
  //   $('.mList div').each(function(){
  //     $(this).remove();
  //   });
  //   $('.mList').append(`<div class="col-12">
  //       <button onclick="bookmarks(1)" class="addButton backButton btn" type="button"></button>
  //     </div>`);
  //   $subBooks.each(function(){
  //     id = $(this).data('id');
  //     name = $(this).data('name');
  //     url = $(this).data('url');
  //     $('.mList').append(`<div class="col-12 col-md-6 col-lg-3">
  //       <a href="`+url+`" target="_blank" class="bookmarkBox">
  //     <div class="bookmark  subBookmark">
  //     <input type="hidden" value="`+catName+`"/>
  //     <input type="hidden" value="`+id+`"/>
  //       <div class="delBox">
  //         <img class="del" src="/images/del.png"/>
  //       </div>
  //       <img class="bookmarkIcon" src="//favicon.yandex.net/favicon/` + getDomain(url) +`"/>
  //       <div class="bookmarkNameBox">
  //         <p class="bookmarkName searchEl">`+name+`</p>
  //         <p class="bookmarkUrl searchEl">`+url+`</p>
  //         </div>
  //       </div>
  //       </a>
  //       </div>`);
  //    });
  //    $('.delBox').each(function(){
  //      $(this).click(function(e){
  //        e.preventDefault();
  //        $buttonBox = $(this).parent();
  //        remove($buttonBox);
  //      });
  //    });
  //    sessionStorage.removeItem('editedCategory');
  //  },1000);
  // }
  $('.categoryBox').each(function(){
    $(this).click(function(){
      catName = $(this).find('.categoryName').text();
      sessionStorage.currentCategory = catName;
      $this = $(this);
      $subBooks = $this.find('.category .subBooks');
      $('.mList div').each(function(){
        $(this).remove();
      });
      $('.mList').append(`<div class="col-12">
          <button onclick="bookmarks(1)" class="addButton backButton btn" type="button"></button>
        </div>`);
      $subBooks.each(function(){
        id = $(this).data('id');
        name = $(this).data('name');
        url = $(this).data('url');
        $('.mList').append(`<div class="col-12 col-md-6 col-lg-3">
          <a href="`+url+`" target="_blank" class="bookmarkBox">
        <div class="bookmark  subBookmark">
        <input type="hidden" value="`+catName+`"/>
        <input type="hidden" value="`+id+`"/>
          <div class="delBox">
            <img class="del" src="/images/del.png"/>
          </div>
          <img class="bookmarkIcon" src="//favicon.yandex.net/favicon/` + getDomain(url) +`"/>
          <div class="bookmarkNameBox">
            <p class="bookmarkName searchEl">`+name+`</p>
            <p class="bookmarkUrl searchEl">`+url+`</p>
            </div>
          </div>
          </a>
          </div>`);
       });
       $('.delBox').each(function(){
         $(this).click(function(e){
           e.preventDefault();
           $buttonBox = $(this).parent();
           remove($buttonBox);
         });
       });
    });
  });

}
function subDel(){

}
