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
                      <ul class="sub-menu" style="display: none;">`+
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

        if(item.hijos!=null && item.idmenuPadre!=null){
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
