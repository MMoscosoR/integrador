<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Usuario extends CI_Model implements JsonSerializable{
    private $idusuario;
    public $vDni;
    public $vNombres;
    public $vApePaterno;
    public $vApeMaterno;
    public $vAlias;
    public $vUsuario;
    public $vPassword;
    public $vCargo;
    public $vTelefono;
    public $vEmail;
    public $dInicio;
    public $dCese;
    public $idarea;
    public $iEstado=1;
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
          return ['idusuario'=>$this->idusuario,'vDni'=>$this->vDni,'vNombres'=>$this->vNombres,'vApePaterno'=>$this->vApePaterno,'vApeMaterno'=>$this->vApeMaterno,
                  'vAlias'=>$this->vAlias,'vUsuario'=>$this->vUsuario,'vCargo'=>$this->vCargo,'vTelefono'=>$this->vTelefono,
                  'vEmail'=>$this->vEmail,'dInicio'=>$this->dInicio,'dCese'=>$this->dCese,'idarea'=>$this->idarea,'iEstado'=>$this->iEstado,
                  'accesos'=>$this->accesos,'autorizaciones'=>$this->autorizaciones];
    }
    //get and setters

    public function save(){
      $this->db->insert('SIS_usuario',$this);
      return $this->db->insert_id();
    }

    public function update($idusuario){
      $this->db->where('idusuario', $idusuario);
      $this->db->update('SIS_usuario', $this);
      return $this->db->affected_rows();
    }
    public function delete($idusuario){
      //eliminar permisos
      $this->db->query("DELETE from SIS_permisos where idacceso in
                        (SELECT idacceso from SIS_accesos
                         where idusuario=".$idusuario.")");

      //eliminar accesos
      $this->db->where('idusuario', $idusuario);
      $this->db->delete('SIS_accesos');

      //eliminar usuario
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
    public function logUsuario($idusuario,$tipo,$mensaje=null){
      $dblog=$this->load->database('log',TRUE);
      $log = array('idusuario' =>$idusuario ,
                    'idregistro'=>$this->idusuario,
                    'jUsuario'=>json_encode($this),
                    'vComentario'=>$mensaje,
                    'vIP'      =>$_SERVER['REMOTE_ADDR'],
                    'dRegistro'=>date('Y-m-d H:i:s'),
                    'vAccion'  =>$tipo
                 );
      $dblog->insert('SIS_usuarios', $log);
    }

    public function findBy($filtros=null,$result=null){

      $this->db->select('*')->from('SIS_usuario');
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
                ->where('a.idusuario',$this->idusuario)->order_by('iOrden');
      $query=$this->db->get();
      $accesos=array();
      foreach ($query->result_array() as $key) {
            $menu= new Menu($key);
            $menu->getHijosAccesos($this->idusuario);

            array_push($accesos,$menu);
      }

      $this->accesos=$accesos;
      return $this->accesos;
    }
    public function getPermisos($idusuario){
        $query=$this->db->query("SELECT idmenu from sis_menu where  vRutaIndex is not null and vRutaIndex !=''");
        $permisos=array();
        foreach ($query->result() as $key) {
            $permiso['idmenu']=$key->idmenu;
            $query2=$this->db->query("SELECT idmenu,idaccion from SIS_accesos a left join SIS_permisos p on a.idacceso=p.idacceso  where idmenu=".$key->idmenu." and idusuario=".$idusuario."");
            $permiso['accesos']=$query2->result();
            array_push($permisos,$permiso);
        }
        return $permisos;
    }
    public function getUsuarios($filtros=null){
        $this->db->select('idusuario Codigo,
                           vNombres Nombres,
                           vApePaterno ApPaterno,
                           vApeMaterno ApMaterno,
                           vUsuario Usuario,
                           vCargo Cargo,
                           vTelefono Telefono,
                           vEmail Email,
                           vNombreArea Area,
                           u.iEstado Estado,
                        ')->from('SIS_usuario u')->join('SIS_area a','u.idarea=a.idarea');
        if(!is_null($filtros)){
          $this->db->where($filtros);
        }
        $query=$this->db->get();
        $response['cabeceras']=$query->list_fields();
        $response['data']=$query->result();
        return $response;
    }
    public function getUsuarioPlanilla($filtro){
      $planilla=$this->load->database('planilla',TRUE);
      $planilla->select('APEPAT vApePaterno
                        ,APEMAT vApeMaterno
                        ,NOMBRE vNombres
                        ,TELEFONO vTelefono
                        ,CARGO vCargo
                        ,convert(date,FECHAING) dInicio
                        ,convert(date,FECHATERMINO) dCese
                        ')->from('trabajadores')->where($filtro);
      $query=$planilla->get();
      return $query->row();
    }
    public function borrarAccesos(){
      $this->db->query("DELETE from SIS_permisos where
                          idacceso in (select idacceso from SIS_accesos where idusuario=".$this->idusuario.")");

      $this->db->query("DELETE from SIS_accesos where idusuario=".$this->idusuario."");
    }




}
