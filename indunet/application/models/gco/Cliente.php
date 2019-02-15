<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cliente extends CI_Model{

  public function __construct()
  {
    parent::__construct();
    //Codeigniter : Write Less Do More
  }
  public function dataSelect2($filtros=null){
    $sap=$this->load->database('sap',TRUE);
            $sap->select('CardCode id,CardName text')
                ->from('ocrd')
                ->where('cardtype','c');
            $query=$sap->get();
            return $query->result();
  }
  public function getdatos($filtro){
            $sap=$this->load->database('sap',TRUE);
            $sap->select('Phone1 vTelefono,E_Mail vEmail,CntctPrsn vContacto')
                ->from('ocrd')
                ->where($filtro);
            $query=$sap->get();
            return $query->row();
        }

}
