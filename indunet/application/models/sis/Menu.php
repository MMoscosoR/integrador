<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Menu extends CI_Model implements JsonSerializable{
    private $idmenu;
    public $idmenuPadre;
    public $vNombreMenu;
    public $vIcono;
    public $vTitulo;
    public $vDescripcion;
    public $vRutaIndex=NULL;
    public $iOrden=10000;
    public $iSensibilidad=0;
    public $iDinamico=0;
    private $hijos=null;
    public $iEstado=1;
    private $permisos=null;

    public function __construct($menu=null){
      //publics
        foreach (get_object_vars($this) as $prop => $var) {

            if(isset($menu[$prop])){
              $this->$prop=$menu[$prop];
        }
        parent::__construct();
        //Codeigniter : Write Less Do More
      }
    }
    public function jsonSerialize() {
      foreach (get_object_vars($this) as $prop => $var) {
            $json[$prop]=$var;
      }
      return $json;
    }

    public function save(){
      $this->db->insert('SIS_menu', $this);
      return $this->db->affected_rows();
    }

    public function update($array){
      foreach ($array as $campo) {
        $this->db->set($campo,$this->$campo);
      }
      $this->db->where('idmenu',$this->idmenu);
      $this->db->update('SIS_menu');
      return $this->db->affected_rows();
    }

    public function getHijos(){
      $this->db->select('*')->from('SIS_menu')->where('idmenuPadre',$this->idmenu)
                ->where('iEstado',1)->order_by('iOrden');
      $query=$this->db->get();
      $hijos=array();
      if($query->row()){
        foreach ($query->result_array() as $key) {
            $menuHijo= new Menu($key);
            $menuHijo->getHijos();
            array_push($hijos,$menuHijo);

        }
        $this->hijos=$hijos;
      }
        return $hijos;

    }
    public function getHijosAccesos($idusuario){
      $this->db->select('*')->from('SIS_menu m')
                ->join('SIS_accesos a','m.idmenu=a.idmenu')
                ->where('idmenuPadre',$this->idmenu)
                ->where('idusuario',$idusuario)
                ->where('iEstado',1)->order_by('iOrden');
      $query=$this->db->get();
      $hijos=array();
      if($query->row()){
        foreach ($query->result_array() as $key) {
            $menuHijo= new Menu($key);
            $menuHijo->getHijosAccesos($idusuario);
            $menuHijo->getPermisos($idusuario);
            array_push($hijos,$menuHijo);

        }
        $this->hijos=$hijos;
      }
        return $hijos;

    }
    public function findBy($filtros=null,$result=null){
      $this->db->select('*')->from('SIS_menu');
      if(!is_null($filtros)){
        $this->db->where($filtros);
      }
      $this->db->order_by('iOrden');
      $query=$this->db->get();

      $menus=array();
      $menu=array();
      if($query->row()){
        foreach ($query->result_array() as $key) {
              $menu= new Menu($key);
              array_push($menus,$menu);
        }
      }
      if(is_null($result)){
        return $menus;
      }else{
        return $menu;
      }
    }

    public function getPermisos($idusuario=null){
      $this->db->select('a.idaccion,vDescripcion,vIcono,VidHTML,a.iEstado')->from('SIS_acciones a')
                ->join('SIS_permisos p','a.idaccion=p.idaccion')
                ->join('SIS_accesos ac','p.idacceso=ac.idacceso')
                ->where('idmenu',$this->idmenu)
                ->where('a.iEstado',1);
                if(!is_null($idusuario)){
                  $this->db->where('idusuario',$idusuario);
                }
      $query=$this->db->get();

      $this->permisos=$query->result_array();
    }

    public function validarAcceso($filtros=null){
      $this->db->select('*')->from('SIS_accesos')->where($filtros);
      $query=$this->db->get();
      if($query->row()){
        return true;
      }else{
        return false;
      }
    }
    public function getidMenuPadre($idmenu){
      $this->db->select('idmenuPadre')->from('SIS_menu')->where('idmenu',$idmenu);
      $query=$this->db->get();
      if($query->row()){
        return $query->row()->idmenuPadre;
      }else{
        return null;
      }

    }
    public function guardarAcceso($idusuario,$idmenu){
      $this->db->insert('SIS_accesos', array('idusuario'=>$idusuario,'idmenu'=>$idmenu));
      return $this->db->insert_id();
    }
    public function guardarPermiso($idacceso,$idaccion){
      $this->db->insert('SIS_permisos', array('idacceso'=>$idacceso,'idaccion'=>$idaccion));
      $this->db->last_query();
    }



}
