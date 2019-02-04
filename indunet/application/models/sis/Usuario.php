<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Usuario extends CI_Model implements JsonSerializable{
    private $idusuario;
    public $vDni;
    public $vNombres;
    public $vApellidos;
    public $vAlias;
    public $vUsuario;
    public $vPassword;
    public $vCargo;
    public $vTelefono;
    public $vEmail;
    public $dInicio;
    public $dCese;
    public $idarea;
    public $iEstado=0;
    //
    private $accesos;
    private $autorizaciones;

    public function __construct($usuario=null)
    {
      //publics
      foreach (get_object_vars($this) as $prop => $var) {

          if(isset($usuario[$prop])){
            $this->$prop=$usuario[$prop];
          }
      }

      parent::__construct();
      $this->load->model(array('sis/Menu'));
    }

    public function jsonSerialize() {
          return ['idusuario'=>$this->idusuario,'vDni'=>$this->vDni,'vNombres'=>$this->vNombres,'vApellidos'=>$this->vApellidos,
                  'vAlias'=>$this->vAlias,'vUsuario'=>$this->vUsuario,'vCargo'=>$this->vCargo,'vTelefono'=>$this->vTelefono,
                  'vEmail'=>$this->vEmail,'dInicio'=>$this->dInicio,'dCese'=>$this->dCese,'idarea'=>$this->idarea,'iEstado'=>$this->iEstado,
                  'accesos'=>$this->accesos,'autorizaciones'=>$this->autorizaciones];
    }
    //get and setters

    public function save(){
      $this->db->insert('SIS_usuario',$this);
      return $this->db->affected_rows();
    }

    public function update($idusuario){
      $this->db->where('idusuario', $idusuario);
      $this->db->update('SIS_usuario', $this);
      return $this->db->affected_rows();
    }
    public function delete($idusuario){
      $this->db->where('idusuario', $idusuario);
      $this->db->delete('SIS_usuario');
      return $this->db->affected_rows();
    }
    public function logAcceso($tipo){
        $dblog=$this->load->database('log',TRUE);
        $log = array('idusuario' =>$this->idusuario ,
                      'jUsuario'=>json_encode($this),
                      'vIP'      =>$_SERVER['REMOTE_ADDR'],
                      'dRegistro'=>date('Y-m-d H:i:s'),
                      'vAccion'  =>$tipo
                   );
        $dblog->insert('SIS_accesos', $log);
    }

    public function findBy($filtros=null,$result=null){

      $this->db->select('*')->from('SIS_usuario')->where('iEstado',0);
      if(!is_null($filtros)){
        $this->db->where($filtros);
      }
      $query= $this->db->get();
      $usuarios= array();
      $usuario=array();

      if($query->row()){
          foreach ($query->result_array() as $key) {
              //recorrer el objeto
              $usuario= new Usuario($key);
              array_push($usuarios,$usuario);
          }

      }
      if(is_null($result)){
        return $usuarios;
      }else{
        return $usuario;
      }

    }

    public function getAccesos(){

      $this->db->select('*')->from('SIS_menu m')
                ->join('SIS_accesos a','m.idmenu=a.idmenu and m.idmenuPadre is null')
                ->where('a.idusuario',$this->idusuario);

      $query=$this->db->get();
      $accesos=array();
      foreach ($query->result_array() as $key) {
            $menu= new Menu($key);
            $menu->getHijos();
            array_push($accesos,$menu);
      }

      $this->accesos=$accesos;
      return $accesos;
    }




}
