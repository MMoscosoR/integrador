<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class RelacionUsuarios extends CI_Controller{

  public function __construct(){
    parent::__construct();
    $this->load->model(array('sis/Usuario','sis/Area','sis/Accion','sis/Menu'));
    $this->load->library('Helper');
  }

  function index(){
    $datos=$this->Usuario->getUsuarios();
    $helper= new Helper();

    $menus= $this->Menu->findBy(array('idmenuPadre'=>NULL));
    foreach ($menus as $key) {
        $key->getHijos();
    }
    $response=$helper->prepararDatosGrilla($datos['cabeceras'],$datos['data']);
    $response['acciones']=$this->Accion->getAcciones();
    $response['menus']=$menus;
    echo json_encode($response);
  }

  function getaAreas(){
    echo json_encode($this->Area->findBy());
  }

  function getUsuarioFromPlan(){
    echo json_encode($this->Usuario->getUsuarioPlanilla($this->input->post()));
  }
  function validarDni(){
    $usuarios=$this->Usuario->findBy($this->input->post());
    if(!$usuarios){
      echo json_encode('true');
    }else{
      echo json_encode('Ya se ha registrado a este usuario');
    }
  }

  function guardar(){
    $menus=array();
    if($this->input->post('accion')=='Guardar'){
      $usuario= new Usuario($this->input->post());
          $idusuario=$usuario->save();
          if($idusuario){
            foreach ($this->input->post('accesos') as $key) {
                $acceso=explode(',',$key);
                if(!in_array($acceso[0],$menus) ){
                  //guardar acceso modulo
                    $idacceso=$this->Menu->guardarAcceso($idusuario,$acceso[0]);
                    //guardar permisos
                    foreach ($this->input->post('accesos') as $key2) {
                      if(explode(',',$key2)[0]==$acceso[0] && explode(',',$key2)[1]!=0){
                          $this->Menu->guardarPermiso($idacceso,explode(',',$key2)[1]);
                      }else{

                      }
                    }
                  //
                  array_push($menus,$acceso[0]);
                    for($i=0;$i<4;$i++){
                        $acceso[0]=$this->Menu->getidMenuPadre($acceso[0]);
                        if(is_null($acceso[0]) || in_array($acceso[0],$menus)){
                          break;
                        }
                        //guardar padres
                        $this->Menu->guardarAcceso($idusuario,$acceso[0]);
                        array_push($menus,$acceso[0]);
                    }
                }
            }

            $userlog= $this->Usuario->findBy(array('idusuario' => $idusuario),'row');
            $userlog->getAccesos();
            $userlog->logUsuario($this->input->post('usuario'),'save');
            echo json_encode('true');
          }
    }
    if($this->input->post('accion')=='Actualizar'){

      $idusuario=$this->input->post('idusuario');
      //verificar si se cambio la contraseña
      if($this->input->post('vPassword')==''){
        $prev= $this->Usuario->findBy(array('idusuario'=>$idusuario),'row');
        $_POST['vPassword']=$prev->vPassword;
      }
      $usuario = new Usuario($this->input->post());

      if($usuario){
        $usuario->update($idusuario);
        $usuario->borrarAccesos();
        foreach ($this->input->post('accesos') as $key) {
            $acceso=explode(',',$key);
            if(!in_array($acceso[0],$menus)){
              //guardar acceso modulo
                $idacceso=$this->Menu->guardarAcceso($idusuario,$acceso[0]);
                //guardar permisos
                foreach ($this->input->post('accesos') as $key2) {
                  if(explode(',',$key2)[0]==$acceso[0] && explode(',',$key2)[1]!=0){
                      $this->Menu->guardarPermiso($idacceso,explode(',',$key2)[1]);
                  }else{

                  }
                }
              //
              array_push($menus,$acceso[0]);
                for($i=0;$i<4;$i++){
                    $acceso[0]=$this->Menu->getidMenuPadre($acceso[0]);
                    if(is_null($acceso[0]) || in_array($acceso[0],$menus)){
                      break;
                    }
                    //guardar padres
                    $this->Menu->guardarAcceso($idusuario,$acceso[0]);
                    array_push($menus,$acceso[0]);
                }
            }
        }
        $userlog= $this->Usuario->findBy(array('idusuario' => $idusuario),'row');
        $userlog->getAccesos();
        $userlog->logUsuario($this->input->post('usuario'),'update');
        echo json_encode('true');
      }
    }
  }
  public function EliminarUsuario(){
    if($this->input->post('vPassword')){
        $usuario=$this->Usuario->findBy(array('vPassword' =>$this->input->post('vPassword'),
                                              'idusuario'=>$this->input->post('idusuario')
                                             ));
        if($usuario){
          $usuarioEliminar=$this->Usuario->findBy(array('idusuario' =>$this->input->post('idregistro')),'row');
          $usuarioEliminar->getAccesos();
          $usuarioEliminar->logUsuario($this->input->post('idusuario'),'delete',$this->input->post('tComentario'));
          $usuarioEliminar->delete($this->input->post('idregistro'));
          $response['status']=1;
          $response['mensaje']='Registro eliminado';
        }else{
          $response['status']=0;
          $response['mensaje']='Contraseña incorrecta';
        }
    }else{
      $usuarioEliminar=$this->Usuario->findBy(array('idusuario' =>$this->input->post('idregistro')),'row');
      $usuarioEliminar->getAccesos();
      $usuarioEliminar->logUsuario($this->input->post('idusuario'),'delete',$this->input->post('tComentario'));
      $usuarioEliminar->delete($this->input->post('idregistro'));
      $response['status']=1;
      $response['mensaje']='Eliminado';

    }
    echo json_encode($response);
  }

  function getDatosUsuario(){
      $response['usuario']=$this->Usuario->findBy($this->input->post(),'row');
      $response['accesos']=$this->Usuario->getPermisos($this->input->post('idusuario'));
      echo json_encode($response);
  }


}
