<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class RelacionModulos extends CI_Controller{

  public function __construct()
  {
    parent::__construct();
    $this->load->model(array('sis/Menu','sis/Usuario'));
  }

  function index()
  {

  }
  public function datajstree(){

    $menus= $this->Menu->findBy(array('idmenuPadre'=>NULL));
    foreach ($menus as $key) {
        $key->getHijos();
    }
    $usuario= new Usuario($this->input->post());
    $usuario->getAccesos();
    $response['menus']=$menus;
    $response['accesos']=$usuario->getAccesos();
    echo json_encode($response,JSON_PRETTY_PRINT);
  }

  public function ordenarMenu(){
    $array_menus=$this->input->post('norden');
    $orden=1;
    foreach ($array_menus as $key) {
          $menu = new Menu(array('idmenu'=>$key['id'],
                                  'idmenuPadre'=>($key['parent']=='#'?NULL:$key['parent']),
                                  'iOrden'=>$orden
                                ));
          $menu->update(array('idmenuPadre','iOrden'));

        $orden++;
    }
    echo json_encode('true');


  }
  public function guardarModulo(){
    $menu= new Menu($this->input->post());
    $response['status']=$menu->save();
    echo json_encode($response);
  }

}
