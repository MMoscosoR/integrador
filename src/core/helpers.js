function menu(accesos){
  let html="";
    $.each(accesos,function(i,item){
      if(item.idmenuPadre==null){
        html=html+`<li class="heading">
                    <h3 class="uppercase">`+item.vNombreMenu+`</h3>`+
                    menu(item.hijos)+
                  `</li>`;
      }

        if(item.hijos!=null && item.idmenuPadre!=null){
          html=html+`<li class="nav-item">
                      <a href="javascript:;" class="nav-link nav-toggle">
                        <i class="`+item.vIcono+`"></i><span class="title">`+item.vNombreMenu+`</span><span class="arrow"></span>
                      </a>
                      <ul class="sub-menu">`+
                        menu(item.hijos)+
                      `</ul>
                    </li>`;
        }else if(item.vRutaIndex!=null){
          html=html+`<li class="nav-item ">
                      <a href="`+item.vRutaIndex+`" data-id="`+item.idmenu+`" class="nav-link menu-principal">
                        <span class="title">`+item.vNombreMenu+`</span>
                      </a>
                    </li>`;
        }


    });
    return html;
}
function listaJstree(accesos){
  let html="<ul>";
    $.each(accesos,function(i,item){
      if(item.idmenuPadre==null){
        html=html+`<li data-id="`+item.idmenu+`" id="`+item.idmenu+`"  data-jstree='{"opened":true}'>`+item.vNombreMenu+
                    listaJstree(item.hijos)+
                  `</li>`;
      }

        if((item.hijos!=null && item.idmenuPadre!=null) || (item.hijos==null && item.idmenuPadre!=null && item.vRutaIndex==null)){
          html=html+`<li data-id="`+item.idmenu+`" id="`+item.idmenu+`" data-jstree='{"opened":true}'>`+item.vNombreMenu+
                        listaJstree(item.hijos)+
                      `</li>`;
        }else if(item.vRutaIndex!=null){
          html=html+`<li data-id="`+item.idmenu+`" id="`+item.idmenu+`" data-jstree='{"icon":"fa fa-file"}'><a href="#">`+item.vNombreMenu+`</a></li>`;
        }


    });
    return html+'</ul>';
}


function cargarHome(accesos){
  $('body').load('src/layouts/home.html',function(e){
    $('body').removeClass();
    $('body').addClass('page-container-bg-solid page-header-fixed page-sidebar-closed-hide-logo');
    $('#menu_principal').html(menu(accesos));
    $('span.username.username-hide-on-mobile').html(sessionStorage.vAlias);

  });
}

jQuery.extend(jQuery.validator.messages, {
    required: "Este campo es obligatorio.",
    remote: "Por favor, rellena este campo.",
    email: "Por favor, escribe una dirección de correo válida",
    url: "Por favor, escribe una URL válida.",
    date: "Por favor, escribe una fecha válida.",
    dateISO: "Por favor, escribe una fecha (ISO) válida.",
    number: "Por favor, escribe un número entero válido.",
    digits: "Por favor, escribe sólo dígitos.",
    creditcard: "Por favor, escribe un número de tarjeta válido.",
    equalTo: "Por favor, escribe el mismo valor de nuevo.",
    accept: "Por favor, escribe un valor con una extensión aceptada.",
    maxlength: jQuery.validator.format("Por favor, no escribas más de {0} caracteres."),
    minlength: jQuery.validator.format("Por favor, no escribas menos de {0} caracteres."),
    rangelength: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
    range: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1}."),
    max: jQuery.validator.format("Por favor, escribe un valor menor o igual a {0}."),
    min: jQuery.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
  });

function drawHeader(acciones){
  let header=`<tr>
                <th>#</th>
                <th>Modulo</th>
                <th>
                  <label class="mt-checkbox mt-checkbox-outline">
                    <input type="checkbox" class="check" value="">
                    <span></span>
                  </label><i title="Marcar todos">SF</i>
                </th>
                <th>
                  <label class="mt-checkbox mt-checkbox-outline">
                    <input type="checkbox" class="a0" value="">
                    <span></span>
                  </label><i title="Visualizar" class="icon-magnifier"></i>
                </th>`;
      $.each(acciones,function(i,item){
        header=header+`<th >
                        <label class="mt-checkbox mt-checkbox-outline" >
                          <input type="checkbox" class="a`+item.idaccion+`" value="">
                          <span></span>
                        </label><i class="`+item.vIcono+`" title="`+item.vDescripcion+`"></i>
                      </th>`;
      });
      header=header+`</tr>`;
      return header;
}

function drawBody(acciones,menus,nombreMenu=null,body=null){

    $.each(menus,function(i,item){
      if(item.idmenuPadre==null){

        nombreMenu=item.vNombreMenu;
        body=drawBody(acciones,item.hijos,nombreMenu,body);
      }

      if((item.hijos!=null && item.idmenuPadre!=null) || (item.hijos==null && item.idmenuPadre!=null && item.vRutaIndex==null)){

        nombreModulo=nombreMenu+' / '+item.vNombreMenu;
          body=drawBody(acciones,item.hijos,nombreModulo,body);

        }
        else if(item.vRutaIndex!=null && item.vRutaIndex!=''){

          nombreMenufinal=nombreModulo +' / '+item.vNombreMenu;

          fila=`<tr>
                  <td>`+item.idmenu+`</td>
                  <td>`+nombreMenufinal+`</td>
                  <td>
                    <label class="mt-checkbox mt-checkbox-outline">
                      <input type="checkbox" class="m`+item.idmenu+`" value="">
                      <span></span>
                    </label><i class="`+item.vIcono+`"></i>
                  </td>
                  <td>
                    <label class="mt-checkbox mt-checkbox-outline">
                      <input type="checkbox" class="m`+item.idmenu+` a0" name="accesos[]" value="`+item.idmenu+`,0">
                      <span></span>
                    </label><i class="`+item.vIcono+`"></i>
                  </td>`;

            $.each(acciones,function(i,accion){
              fila=fila+`<td>
                            <label class="mt-checkbox mt-checkbox-outline">
                              <input type="checkbox" class="m`+item.idmenu+` a`+accion.idaccion+`" name="accesos[]" value="`+item.idmenu+`,`+accion.idaccion+`">
                              <span></span>
                            </label>
                          </td>`;
            });

            fila=fila+`</tr>`;
            body = body + fila;

        }


    });

    return body;
}
function cargarModalEliminar(options){
  $('.modalSensible').load('src/layouts/prompEliminar.html', function(ev) {

    $('#modalEliminar form').attr('action', options.url);
    $('#modalEliminar input[type=hidden]').val(options.idregistro);
    if(options.iSensibilidad==0){
      $('#modalEliminar div.form-pass').html('');
    }
    $('#modalEliminar').modal('show');

  })
}
