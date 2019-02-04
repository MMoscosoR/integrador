<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller{

  public function __construct() {
    parent::__construct();
    $this->load->model(array('sis/Usuario'));
  }

  function index(){
    echo 'error 404 :/';
  }

  function login(){
    header('Access-Control-Allow-Origin: *');
    $response['validate']=false;
    $datos=$this->input->post();
    $usuario= $this->Usuario->findBy($datos,'row');
    if($usuario){

      $response['validate']=true;
      $usuario->getAccesos();
      $response['usuario']=$usuario;
      $usuario->logAcceso('Ingreso');
    }
    echo json_encode($response,JSON_PRETTY_PRINT);

  }

  function logOut(){
    header('Access-Control-Allow-Origin: *');
    $usuario=$this->Usuario->findBy($this->input->post(),'row');
    $usuario->getAccesos();
    $usuario->logAcceso('Salida');
  }

}
