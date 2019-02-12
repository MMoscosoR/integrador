$(document).ready(function () {

  if (sessionStorage.idusuario > 0) {
    cargarHome(JSON.parse(sessionStorage.accesos));
  } else {
    $('body').load('src/layouts/login.html', function (e) {
      $('body').removeClass();
      $('body').addClass('login');
      $(document).off('submit', '.login-form');
      $(document).on('submit', '.login-form', function (e) {
        e.preventDefault();
        let url = servidor + $(this).attr('action');
        let datos = $(this).serialize();
        //alert(datos);
        $.post(url, datos, function (data) {
          data = JSON.parse(data);
          if (data.validate) {
            //guardar datos en sessionStorage
            for (var x in data.usuario) {
              if (x == 'accesos') {
                sessionStorage[x] = JSON.stringify(data.usuario[x]);
              } else {
                sessionStorage[x] = data.usuario[x];
              }
            }
            cargarHome(data.usuario.accesos);
          } else {
            alertify.error('El usuario no existe!');
          }

        });

      });
    });

  }

});

$(document.body).off('click', '.btn_cerrar_session');
$(document.body).on('click', '.btn_cerrar_session', function (e) {
  e.preventDefault();
  $.ajax({
    url: servidor + 'core/Login/logOut',
    data: {
      idusuario: sessionStorage.idusuario
    },
    type: "post",
    success: function (data) {
      sessionStorage.clear();
      location.reload();
    }
  });

});

$(document.body).off('click', '.menu-principal');
$(document.body).on('click', '.menu-principal', function (e) {
  e.preventDefault();
  $('.btn-principales').hide();
  var url = $(this).attr('href');
  sessionStorage.menuactual = $(this).attr('data-id');

  $.ajax({
    url: servidor + 'core/contenido',
    type: "post",
    dataType: 'json',
    data: {
      idusuario: sessionStorage.idusuario,
      idmenu: sessionStorage.menuactual
    },
    beforeSend: function () {
      $('#cuerpo_principal').html('Cargado datos por favor espere...');
    },
    success: function (data) {
      if (data.status) {
        sessionStorage.menuSensibilidad=data.menu.iSensibilidad;
        //dibujar acciones (nuevo editar eliminar etc)
        $('#divacciones').html('');
        $('#ulEspeciales').html('');
        $.each(data.menu.permisos, function (i, item) {
          if(item.iTipo==1){
          $('#divacciones').append(`
            <li class="dropdown dropdown-extended dropdown-notification">
              <a href="javascript:;" class="dropdown-toggle btn-principales" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"
                id="` + item.VidHTML + `" title="` + item.vDescripcion + `">
                <i class="` + item.vIcono + `"></i><span class="hidden-xs"> ` + item.vDescripcion + `</span>
                <span class="badge badge-default"></span>
              </a>
            </li> `);
          }
          if(item.iTipo==2){
            $('nav.quick-nav').show();
            $('#ulEspeciales').append(`<li>
                    <a class="active" id="`+item.VidHTML+`">
                        <span>`+item.vDescripcion+`</span>
                        <i class="`+item.vIcono+`"></i>
                    </a>
                </li>`);
          }
        });

        //dinamico o no
        if(data.menu.iDinamico==0){
          $('#cuerpo_principal').load(data.menu.vRutaIndex,function(event){
            $('span.caption-subject.bold.uppercase').html(data.menu.vTitulo);
          });
        }else{

        }


      } else {
        alertify.error('Usted no tiene acceso a este modulo');
      }

    }
  });
});
