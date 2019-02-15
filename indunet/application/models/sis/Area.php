<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Area extends CI_Model implements JsonSerializable{
    private $idarea;
    public $cCodArea;
    public $vNombreArea;
    public $idempresa;
    public $iEstado=1;

  public function __construct($area=null){
    //publics
    foreach (get_object_vars($this) as $prop => $var) {

        if(isset($area[$prop])){
          $this->$prop=$area[$prop];
        }
    }

    parent::__construct();
    //Codeigniter : Write Less Do More
  }
  public function jsonSerialize() {
        return ['idarea'=>$this->idarea,
                'cCodArea'=>$this->cCodArea,
                'vNombreArea'=>$this->vNombreArea,
                'idempresa'=>$this->idempresa,
                'iEstado'=>$this->iEstado
               ];
    }
  public function getIdarea(){
    return $this;
  }
  public function save(){
    $this->db->insert('SIS_area', $this);

    return $this->db->affected_rows();
  }

  public function update($idarea){
    $this->db->where('idarea', $idarea);
    $this->db->update('SIS_area', $this);

    return $this->db->affected_rows();
  }

  public function delete($idarea){
    $this->db->where('idarea', $idarea);
    $this->db->delete('SIS_area');

    return $this->db->affected_rows();
  }

  public function findBy($filtros=null){
    $this->db->select('*')->from('SIS_area');
    if(!is_null($filtros)){
      $this->db->where($filtros);
    }
    $query=$this->db->get();
    $areas=array();
    if($query->result()){

      foreach ($query->result_array() as $key) {
        //recorrer el objeto
        $area= new Area($key);
        array_push($areas,$area);
      }
    }
    return $areas;
  }
  public function getAreaSelect2(){
    $this->db->select('idarea id,vNombreArea text')->from('SIS_area');
    $query=$this->db->get();
    return $query->result();
  }

}
