<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Accion extends CI_Controller{

  public function __construct()
  {
    parent::__construct();
    //Codeigniter : Write Less Do More
  }

  function index()
  {

  }
  public function getAcciones(){
    $this->db->select('*')->from('SIS_acciones')->where('iEstado',1);
    $query=$this->db->get();
    return $query->result();
  }

}
