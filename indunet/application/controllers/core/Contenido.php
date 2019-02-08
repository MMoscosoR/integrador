<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Contenido extends CI_Controller{

  public function __construct()
  {
    parent::__construct();
    $this->load->model(array('sis/Menu'));
  }

  function index(){

    if($this->Menu->validarAcceso($this->input->post())){

        $menu= $this->Menu->findBy(array('idmenu' =>$this->input->post('idmenu')),'row');
        $menu->getPermisos($this->input->post('idusuario'));
        $response['menu']=$menu;
        $response['status']=true;
    }else{
        $response['status']=false;
    }
      echo json_encode($response);
  }

}
