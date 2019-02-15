<?php
    
    defined('BASEPATH') OR exit('No direct script access allowed');
    
    class Mreportecostos extends CI_Model {

        public function getActivos(){
            $sap=$this->load->database('sap',TRUE);
            $query=$sap->query("select 
                    oitm.ItemCode,
                    oitm.ItemName                                
                    from OITM oitm inner join OWOR owo on oitm.ItemCode=owo.ItemCode where oitm.ItemCode like 'GI%' and oitm.validFor='Y' group by oitm.ItemCode,oitm.ItemName order by oitm.ItemName asc                     
            ");
            return $query->result_array();
        }

        public function getdatacabecera($id=null){
            $sap=$this->load->database('sap',TRUE);
            $query=$sap->query("select U_forma_farma,ItemCode from dbo.OITM where ItemCode='$id'");
            $datajm=$query->row_array();
            return $this->getdataCab($datajm);
        }

        public function verificarGranel($id=null){
            $this->db->where('idGranel',$id);
            $this->db->order_by('dfechaModificacion desc');
            $query=$this->db->get('dbo.GAF_ReportecostosCabecera');
            return $query->row_array();
        }

        public function actualizarCabecera($datos=array()){
            $this->db->set('iEstado',$datos['iEstado']);
            $this->db->where(array(
                'idGranel'=>$datos['idGranel'],
                'nVersion'=>$datos['nVersion']
            ));
            return $this->db->update('GAF_ReportecostosCabecera');
        }

        public function getinfocabecera($id=null){
            $sap=$this->load->database('sap',TRUE);
            $query=$sap->query("select PlannedQty,ItemCode from dbo.OWOR where ItemCode='$id'");
            return $query->row_array();
        }

        public function getdataCab($data=array()){
            if(isset($data) && !empty($data)){
                $this->db->where(array(
                    'idFormaFarmaceutica'=>$data['U_forma_farma']
                ));
                $queryres=$this->db->get('dbo.SIS_formaFarmaceutica');
                $jm=$queryres->row_array();
                return  $jm;
            }
        }

        public function getPrecios(){
            $sap=$this->load->database('sap',TRUE);
            $query=$sap->query("select ItemCode,AvgPrice from OITM where validFor='Y' and ItemCode like 'MP%'");
            return $query->result_array();
        }

        public function getRutagranel($granel=null,$tipo=0){
            $this->db->join('dbo.PRD_Proceso pro','rut.codProceso=pro.codProceso');
            $this->db->where(array(
                'rut.codGranel'=>$granel,
                'pro.idtipoProceso'=>$tipo
            ));
            $this->db->order_by('rut.iOrden');
            //$this->db->group_by('rut.codProceso');
            $query=$this->db->get('dbo.PRD_rutaGranel rut');
            return $query->result_array();
        }

        public function getMaquinasTip(){
            $this->db->select('maq.idMaquina,LTRIM(RTRIM(maq.vCodigo)) as vCodigo,tip.vNombreTipo');
            $this->db->join('dbo.PRD_tipoProceso tip','maq.idTipoProceso=tip.idtipoProceso');
            $query=$this->db->get('dbo.PRD_maquina maq');
            return $query->result_array();
        }

        public function cargarmaquinas(){
            $query=$this->db->get('dbo.prd_maquina');
            return $query->result_array();
        }

        public function getRutagraneljm($granel=null){
            $this->db->join('dbo.PRD_Proceso pro','rut.codProceso=pro.codProceso');
            $this->db->where(array(
                'rut.codGranel'=>$granel,
                'pro.idtipoProceso'=>2
            ));
            $this->db->order_by('rut.iOrden');
            //$this->db->group_by('rut.codProceso');
            $query=$this->db->get('dbo.PRD_rutaGranel rut');
            return $query->result_array();
        }

        public function cargarprocesos($tip=0){
            $this->db->where('idtipoProceso',$tip);
            $query=$this->db->get('dbo.PRD_Proceso');
            return $query->result_array();
        }

        public function getMaquinas($cod=0){
            if($cod>0){
                $this->db->join('dbo.PRD_maquina maq','proc.idmaquina=maq.idmaquina');
                $this->db->where('proc.idproceso',$cod);
                $query=$this->db->get('dbo.PRD_procesoMaquina proc');
            
            }else{
                $query=$this->db->get('dbo.PRD_maquina');
            }

            return $query->result_array();
        }

        public function getProceso($id=0){
            $this->db->where('idproceso',$id);
            $query=$this->db->get('dbo.PRD_Proceso');
            return $query->row_array();
        }

        public function getCabeceragranel($granel=null,$per=0,$ver=0){
            $this->db->where(array(
                'idGranel'=>$granel,
                'nVersion'=>$ver,
                'nPeriodo'=>$per
            ));
            $query=$this->db->get('dbo.GAF_ReportecostosCabecera');
            return $query->row_array();
        }

        public function cargarmaterias($tip=0){
            $sap=$this->load->database('sap',TRUE);
            if($tip==1){
                $query=$sap->query("select 
                        ItemCode,
                        ItemName                                
                        from OITM where ItemCode like 'MP%' and validFor='Y' order by ItemName                       
                ");
            }else{
                $query=$sap->query("select 
                        ItemCode,
                        ItemName                                
                        from OITM where ItemCode like 'ME%' and validFor='Y' order by ItemName                       
                ");
            }
            return $query->result_array();
        }

        public function getMateria($cod=null){
            $sap=$this->load->database('sap',TRUE);
            $sap->where('ItemCode',$cod);
            $query=$sap->get('OITM');
            return $query->row_array();
        }

        public function guardarCabecera($datos=array()){
            $query=$this->db->insert('dbo.GAF_ReportecostosCabecera',$datos['cabecera']);
            if($this->db->affected_rows()==1){
                return $this->db->insert_id();
            }
        }

        public function getActivosDatos(){
            $this->db->select('idGranel');
            $this->db->where('iEstado',1);
            $this->db->group_by('idGranel');
            $query=$this->db->get('GAF_ReportecostosCabecera');
            return $query->result_array();
        }

        public function listaCabeceras(){
            $this->db->where('iEstado',1);
            $query=$this->db->get('GAF_ReportecostosCabecera');
            $res=$query->result_array();
            return $this->sacarnombres($res);
        }

        public function sacarnombres($array=array()){
            $sap=$this->load->database('sap',TRUE);
            foreach($array as $jm=>$arr){
                $sap->select('ItemName');
                $sap->where('ItemCode',$arr['idGranel']);
                $query=$sap->get('OITM');
                $resjm=$query->row_array();
                $array[$jm]['nombregranel']=$resjm['ItemName'];
            }

            return $array;
        }

        public function getProcesos(){
            $this->db->select("idproceso,vNombreProceso");
            $this->db->where(array(
                "iEstado"=>0
            ));
            $query=$this->db->get("dbo.PRD_proceso");
            return $query->result_array();
        }

        public function guardarmo($datos=array()){
            return $this->db->insert("dbo.GAF_ReportecostosMOD",$datos);
        }

        public function guardarmoi($datos=array()){
            $query=$this->db->insert("dbo.GAF_ReportecostosMOI",$datos);
            if($this->db->affected_rows()==1){
                return 1;
            }

            return 2;
        }

        public function guardarMaterias($datos=array()){
            $query=$this->db->insert("dbo.GAF_ReportecostosMaterias",$datos);
            if($this->db->affected_rows()==1){
                return 1;
            }

            return 2;
        }

        public function guardarotros($datos=array()){
            $query=$this->db->insert("dbo.GAF_ReportecostosOtros",$datos);
            if($this->db->affected_rows()==1){
                return 1;
            }

            return 2;
        }

        public function getVersionesgranel($cod=null,$tipo=0){
            $this->db->where('idGranel',$cod);
            if($tipo==2){
                $this->db->where('iEstado',1);
            }
            $this->db->order_by('idreporteCabecera asc');
            $query=$this->db->get("GAF_ReportecostosCabecera");
            return $query->result_array();
        }

        /*public function guardarmaterias($datos=array()){
            return $this->db->insert("GAF_ReportecostosMaterias",$datos);
        }*/

        public function getRatios($t=0){
            $query=$this->db->get("dbo.GAF_ratiosGenerales");
            return $query->result_array();
        }

        public function getRutagraneledit($granel=null,$tipo=0,$per=0,$ver=0){
            $this->db->select('mod.*');
            $this->db->join('GAF_ReportecostosMOD mod','cab.idreporteCabecera=mod.idreporteCabecera');
            $this->db->where(array(
                'idGranel'=>$granel,
                'iTipo'=>$tipo,
                'nPeriodo'=>$per,
                'nVersion'=>$ver
            ));
            $query=$this->db->get('GAF_ReportecostosCabecera cab');
            return $query->result_array();
        }

        public function getOtros($granel=null,$per=0,$ver=0){
            $this->db->join('GAF_ReportecostosOtros otro','cab.idreporteCabecera=otro.idreporteCabecera');
            $this->db->where(array(
                'idGranel'=>$granel,
                'nPeriodo'=>$per,
                'nVersion'=>$ver
            ));
            $query=$this->db->get('GAF_ReportecostosCabecera cab');
            return $query->result_array();
        }

        public function getMateriasedit($granel=null,$per=0,$ver=0){
            $this->db->join('GAF_ReportecostosMaterias mat','cab.idreporteCabecera=mat.idreporteCabecera');
            $this->db->where(array(
                'idGranel'=>$granel,
                'nPeriodo'=>$per,
                'nVersion'=>$ver
            ));
            $query=$this->db->get('GAF_ReportecostosCabecera cab');
            return $query->result_array();
        }

        public function getMoiedit($granel=null,$per=0,$ver=0){
            $this->db->join('GAF_ReportecostosMoi moi','cab.idreporteCabecera=moi.idreporteCabecera');
            $this->db->where(array(
                'idGranel'=>$granel,
                'nPeriodo'=>$per,
                'nVersion'=>$ver
            ));
            $query=$this->db->get('GAF_ReportecostosCabecera cab');
            return $query->result_array();
        }

        public function cargarinfo($id=0){
            $this->db->where(array(
                'idMenu'=>$id,
                'iEstado'=>1
            ));
            $query=$this->db->get('SIS_menuAcciones');
            return $query->result_array();
        }

        public function getUsuarios(){
            $this->db->select('IdUsuario,vUsuario');
            $query=$this->db->get('SIS_usuario');
            return $query->result_array();
        }

        public function guardarAutorizaciones($datos=array()){
            return $this->db->insert('SIS_autorizacionUsuario',$datos);
        }
        
        public function getautorizados($id=0){
            $this->db->select('aut.*');
            $this->db->join('SIS_menuAcciones men','aut.idmenuaccion=men.idmenuaccion');
            $this->db->where('men.idMenu',$id);
            $query=$this->db->get('SIS_autorizacionUsuario aut');
            return $query->result_array();
        }

        public function deleteAutorizaciones($id=0){
            $this->db->where('idmenu',$id);
            return $this->db->delete('SIS_autorizacionUsuario');
        }

        public function getAutosbyUsuario($idu=0,$idm=0){
            $this->db->select('aut.idmenuaccion,men.vClass');
            $this->db->join('SIS_menuAcciones men','aut.idmenuaccion=men.idmenuaccion');
            $this->db->where(array(
                'aut.idUsuario'=>$idu,
                'aut.idmenu'=>$idm
            ));
            $query=$this->db->get('SIS_autorizacionUsuario aut');
            return $query->result_array();
        }
    }
    
    
