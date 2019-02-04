<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Testing extends CI_Controller{

  public function __construct()
  {
    parent::__construct();
    $this->load->model(array('sis/Usuario','sis/Area','sis/Menu'));
  }

  function index()
  {
    $user = array('idmenu' =>'76279485' ,
                  'vNombres'=>'Marco',
                  'vApellidos'=>'Moscoso',
                  'vAlias'=>'Marco Moscoso',
                  'vPassword'=>'marco291'
                  );

    $usuario= new Menu($user);
    //echo $usuario->save();
    echo json_encode($usuario->jsonSerialize());
    //echo json_encode($this->Area->findBy(),JSON_PRETTY_PRINT);

  }

}
