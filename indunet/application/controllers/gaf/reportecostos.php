<?php 

defined('BASEPATH') OR exit('No direct script access allowed');

class Reportecostos extends CI_Controller {

    
    public function __construct()
    {
        parent::__construct();
        $this->load->model(array('gaf/mreportecostos','gaf/Mdepreciacion'));
        
    }

    public function RelacionActivos(){
        $activos=$this->mreportecostos->getActivos();
        $activosConDatos=array_column($this->mreportecostos->getActivosDatos(),'idGranel');
        foreach($activos as $jm=>$activo){
            //$activos[$jm]['dis']=0;
            if(in_array($activo['ItemCode'],$activosConDatos)){
                unset($activos[$jm]);
            }
        }
        $dataok=array();

        foreach($activos as  $jm=>$activo){
            $dataok[$jm][]=$activo['ItemCode'];
            $dataok[$jm][]=$activo['ItemName'];
        }
        $dataok=array_values($dataok);
//print_r('<pre>');
//print_r($dataok); exit;

        echo json_encode($dataok);
    }

    public function getactivos()
    {   
        $activos=$this->mreportecostos->getActivos();
        $activosConDatos=array_column($this->mreportecostos->getActivosDatos(),'idGranel');
        foreach($activos as $jm=>$activo){
            $activos[$jm]['dis']=0;
            if(in_array($activo['ItemCode'],$activosConDatos)){
                $activos[$jm]['dis']=1;
            }
        }
        $data['activos']=$activos;
        $data['procesos']=$this->mreportecostos->getProcesos();
        $ratios=$this->mreportecostos->getRatios();
        $data['ratios_fab']=array_column($ratios,'nRatioOperarioProduccion');
        $data['ratios_acon']=array_column($ratios,'nRatioOperarioAcondicionado');
        $arrayfab=array();
        $arrayacon=array();
        $arraypp=array();
        $arraypt=array();
        $arraymp=array();
        foreach($ratios as $i=>$ratio){
            $arrayfab[$i]['nom']=$ratio['vNombreRatio'];
            $arrayfab[$i]['dato']=$ratio['nRatioProfesionalProduccion'];
            $arrayacon[$i]['nom']=$ratio['vNombreRatio'];
            $arrayacon[$i]['dato']=$ratio['nRatioProfesionalAcondicionado'];
            $arraypp[$i]['nom']=$ratio['vNombreRatio'];
            $arraypp[$i]['dato']=$ratio['nRatioLabPP'];
            $arraypt[$i]['nom']=$ratio['vNombreRatio'];
            $arraypt[$i]['dato']=$ratio['nRatioLabPT'];
            $arraymp[$i]['nom']=$ratio['vNombreRatio'];
            $arraymp[$i]['dato']=$ratio['nRatioLabMP'];
        }
        $data['ratios_moi_fab']=$arrayfab;
        $data['ratios_moi_acon']=$arrayacon;
        $data['ratios_moi_pp']=$arraypp;
        $data['ratios_moi_pt']=$arraypt;
        $data['ratios_moi_mp']=$arraymp;
        $depre=$this->Mdepreciacion->getDatosDepre();
        $data['depreciacion']=$depre;
        
        echo json_encode($data);
    }

    public function getdatacabecera(){
        $idc=$this->input->post('idprin');
        $datacabecera['cabecera']=$this->mreportecostos->getdatacabecera($idc);
        $datacabecera['info']=$this->mreportecostos->getinfocabecera($idc);
        echo json_encode($datacabecera);
    }

    public function getRuta(){
        $granel=$this->input->post('granel');
        $dataruta=$this->mreportecostos->getRutagranel($granel);
        foreach($dataruta as $jm=>$data){
            $maquinas=$this->mreportecostos->getMaquinas($data['idproceso']);
            $dataruta[$jm]['maquinas']=$maquinas;
        }

        echo json_encode($dataruta);
    }    

    public function getRutajm(){
        $granel=$this->input->post('granel');
        $dataruta=$this->mreportecostos->getRutagraneljm($granel);
        foreach($dataruta as $jm=>$data){
            $maquinas=$this->mreportecostos->getMaquinas($data['idproceso']);
            $dataruta[$jm]['maquinas']=$maquinas;
        }

        echo json_encode($dataruta);
    }

    public function actualizarcabecera(){
        $post=$this->input->post();
        $this->mreportecostos->actualizarCabecera($post);
    }

    public function visualizarversiones(){
        $granel=$this->input->post('granel');
        $tipo=$this->input->post('tipo');
        $versiones=$this->mreportecostos->getVersionesgranel($granel,$tipo);
        $array_ver=array();
        foreach($versiones as $jm=>$version){
            $array_ver[$version['nVersion']]['idreporteCabecera']=$version['idreporteCabecera'];
            $array_ver[$version['nVersion']]['nPeriodo']=$version['nPeriodo'];
            $array_ver[$version['nVersion']]['nVersion']=str_pad($version['nVersion'],5, "0", STR_PAD_LEFT);
            $array_ver[$version['nVersion']]['vTitulo']=$version['vTitulo'];
            $array_ver[$version['nVersion']]['iEstado']=$version['iEstado'];
            $array_ver[$version['nVersion']]['idGranel']=$version['idGranel'];
            $array_ver[$version['nVersion']]['dfechaModificacion']=$version['dfechaModificacion'];
        }

        
        if(isset($versiones) && !empty($versiones)){
            for($j=(count($array_ver))-1;$j>=0;$j--){
                $versionesjm[$j]=$array_ver[$j];
            }
            $versionesjm=array_values($versionesjm);
            foreach($versionesjm as $jm=>$version){
                setlocale(LC_ALL, 'es_ES.UTF-8');
                $versionesjm[$jm]['fechajm']=strftime("%e de %B del %Y",strtotime($version['dfechaModificacion']));
            }

            //print_r($versiones); exit;
            $data['versiones']=$versionesjm;
            $data['respuesta']=1;
        }else{
            $data['respuesta']=2;
        }
        echo json_encode($data);
    }

    public function getOtros(){
        $jm=$this->input->post("edit");

        if(isset($jm) && !empty($jm) && $jm==1){

            $granel=$this->input->post('granel');
            $per=$this->input->post('per');
            $ver=$this->input->post('ver');
            $datajm=$this->mreportecostos->getOtros($granel,$per,$ver);
            $datamate=$this->mreportecostos->getMateriasedit($granel,$per,$ver);
            $datamoi=$this->mreportecostos->getMoiedit($granel,$per,$ver);
            
            //print_r($datamoi); exit;
            for($i=0;$i<3;$i++){
                $dataotros['moi'][$i]['datofab']="";
                $dataotros['moi'][$i]['datoacon']="";
                $dataotros['moi'][$i]['datolabpp']="";
                $dataotros['moi'][$i]['datolabpt']="";
                $dataotros['moi'][$i]['datolabmp']="";
            }
            $dataotros['moi'][0]['datolabpp']=$datamoi[0]['dLabpp'];
            $dataotros['moi'][0]['datolabpt']=$datamoi[0]['dLabpp'];
            $dataotros['moi'][0]['datolabmp']=$datamoi[0]['dLabmp'];

            $dataotros['moi'][1]['datofab']=$datamoi[1]['dCantidadFab'];
            $dataotros['moi'][1]['datoacon']=$datamoi[1]['dCantidadAcon'];
            $dataotros['moi'][1]['datolabpp']=$datamoi[1]['dLabpp'];
            $dataotros['moi'][1]['datolabpt']=$datamoi[1]['dLabpp'];
            $dataotros['moi'][1]['datolabmp']=$datamoi[1]['dLabmp'];
               


            
                foreach($datajm as $k=>$data){
                    if($data['vArea']=='PP'){
                        $dataotros['otros_2'][]=$data;
                    }else if($data['vArea']=='MP'){
                        $dataotros['otros_3'][]=$data;
                    }else if($data['vArea']=='PT'){
                        $dataotros['otros_4'][]=$data;
                    }else{
                        if($data['vArea']==null && $data['vMaquina']!=null){
                            $dataotros['otros_5'][]=$data;
                        }else{
                            $dataotros['otros_1']=$data['tData'];
                        }
                    }
                    unset($datajm[$k]['idreporteotros']);
                }

                if(!isset($dataotros['otros_2'])){
                    for($i=0;$i<4;$i++){
                        $dataotros['otros_2'][$i]["vArea"]="PP";
                        $dataotros['otros_2'][$i]["vMaquina"]="";
                        $dataotros['otros_2'][$i]['dHoramaq']="";  
   
                    }
                }
                if(!isset($dataotros['otros_3'])){
                    for($i=0;$i<14;$i++){
                        $dataotros['otros_3'][$i]["vArea"]="MP";
                        $dataotros['otros_3'][$i]["vMaquina"]="";
                        $dataotros['otros_3'][$i]['dHoramaq']="";
                    }

                }
                if(!isset($dataotros['otros_4'])){
                    for($i=0;$i<14;$i++){
                        $dataotros['otros_4'][$i]["vArea"]="PT";
                        $dataotros['otros_4'][$i]["vMaquina"]="";
                        $dataotros['otros_4'][$i]['dHoramaq']="";
                    }
                }
                if(!isset($dataotros['otros_5'])){
                    for($i=0;$i<4;$i++){

                        $dataotros['otros_5'][$i]["vMaquina"]="";
                        $dataotros['otros_5'][$i]["tipo"]="";
                        $dataotros['otros_5'][$i]["dHoramaq"]="";
                    }
                }

            //print_r($dataotros); exit;

                foreach($datamate as $i=>$mate){
                    
                    $datamate[$i]['referencia']='';
                    $datamate[$i]['diferencia']='';
                    $datamate[$i]['resultado']='';
                    unset($datamate[$i]['idreportematerial']);
                }
                foreach($datamate as $i=>$mate){
                    if($mate['iTipo']==1){
                        $dataotros['materia'][]=$mate;
                        
                    }else{
                        $dataotros['materia2'][]=$mate;
                    }
                }

                if(!isset($dataotros['materia'])){
                    for($i=0;$i<6;$i++){
                        $dataotros['materia'][$i]["codMateria"]='';
                        $dataotros['materia'][$i]["vNombreMateria"]='';
                        $dataotros['materia'][$i]["nCostoUnidad"]='';
                        $dataotros['materia'][$i]["vUnidadMedida"]='';
                        $dataotros['materia'][$i]["dCalculo"]='';
                        $dataotros['materia'][$i]["referencia"]='';
                        $dataotros['materia'][$i]["diferencia"]='';
                        $dataotros['materia'][$i]["resultado"]='';

                    }
                }

                if(!isset($dataotros['materia2'])){
                    for($i=0;$i<6;$i++){
         
                        $dataotros['materia2'][$i]["codMateria"]='';
                        $dataotros['materia2'][$i]["vNombreMateria"]='';
                        $dataotros['materia2'][$i]["nCostoUnidad"]='';
                        $dataotros['materia2'][$i]["vUnidadMedida"]='';
                        $dataotros['materia2'][$i]["dCalculo"]='';
                        $dataotros['materia2'][$i]["resultado"]='';
                    }
                }
           
            //print_r($dataotros['materia']); exit;

        }else{
            for($i=0;$i<4;$i++){
                $dataotros['otros_2'][$i]["vArea"]="PP";
                $dataotros['otros_2'][$i]["vMaquina"]="";
                $dataotros['otros_2'][$i]['dHoramaq']="";  
                
                $dataotros['otros_5'][$i]["vMaquina"]="";
                $dataotros['otros_5'][$i]["tipo"]="";
                $dataotros['otros_5'][$i]["dHoramaq"]="";
            }

            for($i=0;$i<3;$i++){
                $dataotros['moi'][$i]['datofab']="";
                $dataotros['moi'][$i]['datoacon']="";
                $dataotros['moi'][$i]['datolabpp']="";
                $dataotros['moi'][$i]['datolabpt']="";
                $dataotros['moi'][$i]['datolabmp']="";
            }

            //$dataotros['moi']['']


            for($i=0;$i<14;$i++){
                $dataotros['otros_3'][$i]["vArea"]="MP";
                $dataotros['otros_3'][$i]["vMaquina"]="";
                $dataotros['otros_3'][$i]['dHoramaq']="";

                $dataotros['otros_4'][$i]["vArea"]="PT";
                $dataotros['otros_4'][$i]["vMaquina"]="";
                $dataotros['otros_4'][$i]['dHoramaq']="";
            }

            for($i=0;$i<6;$i++){
                $dataotros['materia'][$i]["codMateria"]='';
                $dataotros['materia'][$i]["vNombreMateria"]='';
                $dataotros['materia'][$i]["nCostoUnidad"]='';
                $dataotros['materia'][$i]["vUnidadMedida"]='';
                $dataotros['materia'][$i]["dCalculo"]='';
                $dataotros['materia'][$i]["referencia"]='';
                $dataotros['materia'][$i]["diferencia"]='';
                $dataotros['materia'][$i]["resultado"]='';

                $dataotros['materia2'][$i]["codMateria"]='';
                $dataotros['materia2'][$i]["vNombreMateria"]='';
                $dataotros['materia2'][$i]["nCostoUnidad"]='';
                $dataotros['materia2'][$i]["vUnidadMedida"]='';
                $dataotros['materia2'][$i]["dCalculo"]='';
                $dataotros['materia2'][$i]["resultado"]='';
            }

            
        }

        

        $dataotros['precios']=$this->mreportecostos->getPrecios();
        $dataotros['maquinas']=$this->mreportecostos->getMaquinasTip();


        echo json_encode($dataotros,JSON_NUMERIC_CHECK);
    }

    /*public function getPrecios(){
        $precios=$this->mreportecostos->getPrecios();
        echo json_encode($precios); exit;
    }*/

    public function getRutav2(){
        $granel=$this->input->post('granel');
        $tipo=$this->input->post('tipo');
        $edit=$this->input->post('edit');
        $per=$this->input->post('per');
        $ver=$this->input->post('ver');
        if(isset($edit) && !empty($edit) && $edit==1){
            $dataruta=$this->mreportecostos->getRutagraneledit($granel,$tipo,$per,$ver);
            foreach($dataruta as $key=>$data){
                for($j=1;$j<14;$j++){
                    $dataruta[$key]['proc_'.$j]='0';
                }
                $dataruta[$key]['total']='0';
                $dataruta[$key]['unidad']='0';
                unset($dataruta[$key]['idmanoobra']);
            }
            //print_r($dataruta); exit;
        }else{
            $dataruta=$this->mreportecostos->getRutagranel($granel,$tipo);
            foreach($dataruta as $key=>$data){
                //$dataruta[$key]['maquina']='';
                $dataruta[$key]['nSetupHH']='0';
                $dataruta[$key]['nProcesoHH']='0';
                $dataruta[$key]['nProcesoHM']='0';
                $dataruta[$key]['nLimpiezaMaq']='0';
                $dataruta[$key]['nLimpiezaAre']='0';
                
                for($j=1;$j<14;$j++){
                    $dataruta[$key]['proc_'.$j]='0';
                }
                $dataruta[$key]['nSubtotalHH']='0.00';
                $dataruta[$key]['nSubtotalHM']='0.00';
                $dataruta[$key]['nSubtotalHP']='0.00';
                $dataruta[$key]['total']='0';
                $dataruta[$key]['unidad']='0';
                $dataruta[$key]['nOperadores']='0';
                $dataruta[$key]['vObservacion']='';
                unset($dataruta[$key]['idruta']);
                unset($dataruta[$key]['iOrden']);
                unset($dataruta[$key]['idruta']);
                unset($dataruta[$key]['iEstado']);
                unset($dataruta[$key]['codgranel']);
                unset($dataruta[$key]['codProceso']);
                unset($dataruta[$key]['maquina']);
                unset($dataruta[$key]['idtipoProceso']);
                if($data['codMaquina']==''){
                    $dataruta[$key]['codMaquina']='NA';
                }
                //print_r($dataruta); exit;
            }


            
        }
        $datarutatotal['data']=$dataruta;

        $procesos=$this->mreportecostos->cargarprocesos($tipo);

        $maquinas=$this->mreportecostos->cargarmaquinas();

        foreach($maquinas as $jm=>$maquina){
            
            $maquinas[$jm]['codMaquina']=$maquina['vCodigo'];
        }

        $maquinas[0]['idmaquina']=0;
        $maquinas[0]['codMaquina']='NA';

        $datarutatotal['procesos']=$procesos;
        $datarutatotal['maquinas']=$maquinas;
        
        //print_r(json_encode($dataruta)); exit;
        echo json_encode($datarutatotal,JSON_NUMERIC_CHECK);
    }

    public function regDatos(){
        $post=$this->input->post();
        //print_r($post); exit;
        if(isset($post['data']) && !empty($post['data'])){
            //$data['fabricacion']['data']=array_chunk($post['data'],12);
            foreach($post['data'] as $jm=>$dat){
                if(!isset($dat['maq'])){
                    $post['data'][$jm]['maq']=['na'];
                }
            }
            $data['fabricacion']['data']=$post['data'];
        }
        if(isset($post['dataacondicionado']) && !empty($post['dataacondicionado'])){
            //$data['acondicionado']['data']=array_chunk($post['dataacondicionado'],12);
            foreach($post['dataacondicionado'] as $jm=>$dat){
                if(!isset($dat['maq'])){
                    $post['dataacondicionado'][$jm]['maq']=['na'];
                }
            }
            $data['acondicionado']['data']=$post['data'];
        }
        print_r(json_encode($data)); exit; 
    }

    public function calculardata(){
        $post=$this->input->post();
        //print_r($post); exit;
        for($jm=2;$jm<=9;$jm++){
            $total["sum_".$jm]=floatval(array_sum(array_column($post['data'],$jm)));
            $total["sum2_".$jm]=floatval(array_sum(array_column($post['dataacondicionado'],$jm)));
        }

        $data=array_values($post['data']);
        $dataacondicionado=array_values($post['dataacondicionado']);

        //print_r($dataacondicionado); exit;

        for($i=0;$i<count($data);$i++){
            $total["sub_hhprod"][]=($data[$i][2]+$data[$i][3]+$data[$i][5])*$data[$i][7];
            $total["sub_hmprod"][]=($data[$i][4]+$data[$i][6]);
        }

        for($i=0;$i<count($dataacondicionado);$i++){
            $total["sub_hhacon"][]=($dataacondicionado[$i][2]+$dataacondicionado[$i][3]+$dataacondicionado[$i][5])*$dataacondicionado[$i][7];
            $total["sub_hmacon"][]=($dataacondicionado[$i][4]+$dataacondicionado[$i][6]);
        }
        //print_r($total); exit;
        echo json_encode($total);
    }

    public function cargarprocesos(){
        $tipo=$this->input->post('tipo');
        $procesos=$this->mreportecostos->cargarprocesos($tipo);
        echo json_encode($procesos);
    }

    public function nuevamateria(){
        $mat=$this->input->post('proceso');
        $materia=$this->mreportecostos->getMateria($mat);
        $datamateria=array(
            'ItemCode'=>$materia['ItemCode'],
            'ItemName'=>$materia['ItemName'],
            'costounidad'=>'0.00',
            'BuyUnitMsr'=>$materia['BuyUnitMsr'],
            'calculo'=>'0.00',

        );
        echo json_encode($datamateria);
    }

    public function cargarmaterias(){
        $tipo=$this->input->post('tipo');
        $materias=$this->mreportecostos->cargarmaterias($tipo);
        echo json_encode($materias);
    }

    public function getMaquinas(){
        $cod=$this->input->post('cod');
        $maquinas=$this->mreportecostos->getMaquinas($cod);
        echo json_encode($maquinas);
    }

    public function nuevoproceso(){
        $proceso=$this->input->post('proceso');
        
        $dataproceso=$this->mreportecostos->getProceso($proceso);
        $calculo=$this->input->post('tipo_calculo');
        if(isset($calculo) && !empty($calculo)){
            $dataproceso['tipo_calculo']=$calculo;
        }
        $dataproceso['maquinas']=$this->mreportecostos->getMaquinas($proceso);
        echo json_encode($dataproceso);
    }

    public function guardardatatotal(){
        $post=$this->input->post();
        
        $post['cabecera']['dfechaModificacion']=date('Y-m-d H:i:s');
        $post['cabecera']['nPeriodo']=$post['periodo'];
        $post['cabecera']['nVersion']=$post['version'];

        $datacabecera=array();
        $datacabecera['nVersion']=$post['version'];
        $datacabecera['idGranel']=$post['cabecera']['idGranel'];
        $datacabecera['iEstado']=$post['cabecera']['iEstado'];
        
        
        $guardar=$this->mreportecostos->guardarCabecera($post);

        $this->mreportecostos->actualizarCabecera($datacabecera);
        //exit;
        //$guardar=14;
        $datamod=json_decode($post['datamodf'],TRUE);
        $datamoi=json_decode($post['datamoda'],TRUE);
        $datamateriaprima=json_decode($post['datamateriaprima'],TRUE);
        $datamateriaempaque=json_decode($post['datamateriaempaque'],TRUE);
        $datamoindirecta=json_decode($post['datamoi'],TRUE);
        $dataotros2=json_decode($post['dataotros2'],TRUE);
        $dataotros3=json_decode($post['dataotros3'],TRUE);
        $dataotros4=json_decode($post['dataotros4'],TRUE);
        $dataotros5=json_decode($post['dataotros5'],TRUE);
        $dataotros1=$post['dataotros1'];
        /*print_r($datamateriaprima); exit;
        print_r($dataotros2); 
        print_r($dataotros3); 
        print_r($dataotros4); 
        print_r($dataotros5);
        exit;*/
        //print_r($dataotros1); exit;

        if(!empty($datamod) && !empty($datamoi) && !empty($datamateriaprima) &&
        !empty($datamateriaempaque) && !empty($datamoindirecta) && !empty($dataotros2)
        && !empty($dataotros3) && !empty($dataotros4) && !empty($dataotros5) && !empty($dataotros1)){

            $data['GAF_ReportecostosOtros']=array_values(array_merge($this->preparardataotros($dataotros2,$guardar),$this->preparardataotros($dataotros3,$guardar),
            $this->preparardataotros($dataotros4,$guardar),$this->preparardataotros($dataotros5,$guardar)));
            $data['GAF_ReportecostosMOI']=$this->preparardatamoindirecta($datamoindirecta,$guardar);
            $data['GAF_ReportecostosMOD']=array_values(array_merge($this->preparardatamod($datamod,$guardar),$this->preparardatamoi($datamoi,$guardar)));
            $data['GAF_ReportecostosMaterias']=array_values(array_merge($this->preparardatamateria($datamateriaprima,$guardar),$this->preparardatamateriaempaque($datamateriaempaque,$guardar)));
            //print_r($data); exit;
            //print_r($data['GAF_ReportecostosOtros']); exit;
            foreach($data['GAF_ReportecostosMaterias'] as $materia){
                $this->mreportecostos->guardarmaterias($materia);
            }

            foreach($data['GAF_ReportecostosMOD'] as $mod){
                $this->mreportecostos->guardarmo($mod);
            }

            foreach($data['GAF_ReportecostosMOI'] as $mod){
                $this->mreportecostos->guardarmoi($mod);
            }

            foreach($data['GAF_ReportecostosOtros'] as $mod){
                $this->mreportecostos->guardarotros($mod);
            }

            $dataotrosjm=array("idreporteCabecera"=>$guardar,"tData"=>$dataotros1);
            $this->mreportecostos->guardarotros($dataotrosjm);
            //print_r($jm); exit;
            echo 1;
        }else{
            echo 2;
        }
    }

    public function guardaravance(){
        $post=$this->input->post();
        //print_r($post); exit;
        $post['cabecera']['dfechaModificacion']=date('Y-m-d H:i:s');
        $post['cabecera']['nPeriodo']=$post['periodo'];
        $post['cabecera']['nVersion']=$post['version'];

        $datacabecera=array();
        $datacabecera['nVersion']=$post['version'];
        $datacabecera['idGranel']=$post['cabecera']['idGranel'];
        $datacabecera['iEstado']=$post['cabecera']['iEstado'];
        
        
        $guardar=$this->mreportecostos->guardarCabecera($post);

        $this->mreportecostos->actualizarCabecera($datacabecera);
        //exit;
        //$guardar=14;
        $datamod=json_decode($post['datamodf'],TRUE);
        $datamoi=json_decode($post['datamoda'],TRUE);
        $datamateriaprima=json_decode($post['datamateriaprima'],TRUE);
        $datamateriaempaque=json_decode($post['datamateriaempaque'],TRUE);
        $datamoindirecta=json_decode($post['datamoi'],TRUE);
        $dataotros2=json_decode($post['dataotros2'],TRUE);
        $dataotros3=json_decode($post['dataotros3'],TRUE);
        $dataotros4=json_decode($post['dataotros4'],TRUE);
        $dataotros5=json_decode($post['dataotros5'],TRUE);
        $dataotros1=$post['dataotros1'];

        /*print_r($datamod);
        print_r($datamoi);
        print_r($datamateriaprima);
        print_r($datamateriaempaque); 
        print_r($datamoindirecta);
        print_r($dataotros2); 
        print_r($dataotros3); 
        print_r($dataotros4); 
        print_r($dataotros5);
        print_r($dataotros1);
        //$guardar=14;
        exit;*/
        //print_r($dataotros1); exit;

       

            $data['GAF_ReportecostosOtros']=array_values(array_merge($this->preparardataotros($dataotros2,$guardar),$this->preparardataotros($dataotros3,$guardar),
            $this->preparardataotros($dataotros4,$guardar),$this->preparardataotros($dataotros5,$guardar)));
            $data['GAF_ReportecostosMOI']=$this->preparardatamoindirecta($datamoindirecta,$guardar);
            $data['GAF_ReportecostosMOD']=array_values(array_merge($this->preparardatamod($datamod,$guardar),$this->preparardatamoi($datamoi,$guardar)));
            $data['GAF_ReportecostosMaterias']=array_values(array_merge($this->preparardatamateria($datamateriaprima,$guardar),$this->preparardatamateriaempaque($datamateriaempaque,$guardar)));
            //print_r($data); exit;
            //print_r($data['GAF_ReportecostosOtros']); exit;
            if(isset($data['GAF_ReportecostosMaterias']) && !empty($data['GAF_ReportecostosMaterias'])){
                foreach($data['GAF_ReportecostosMaterias'] as $materia){
                    $this->mreportecostos->guardarmaterias($materia);
                }   
            }

            if(isset($data['GAF_ReportecostosMOD']) && !empty($data['GAF_ReportecostosMOD'])){
                foreach($data['GAF_ReportecostosMOD'] as $mod){
                    $this->mreportecostos->guardarmo($mod);
                }
            }

            if(isset($data['GAF_ReportecostosMOI']) && !empty($data['GAF_ReportecostosMOI'])){
                foreach($data['GAF_ReportecostosMOI'] as $mod){
                    $this->mreportecostos->guardarmoi($mod);
                }
            }

            if(isset($data['GAF_ReportecostosOtros']) && !empty($data['GAF_ReportecostosOtros'])){
                foreach($data['GAF_ReportecostosOtros'] as $mod){
                    $this->mreportecostos->guardarotros($mod);
                }
            }

            $dataotrosjm=array("idreporteCabecera"=>$guardar,"tData"=>$dataotros1);
            $this->mreportecostos->guardarotros($dataotrosjm);
            //print_r($jm); exit;
            echo 1;
        
    }

    public function preparardatamoindirecta($data=array(),$id){
        $datamoi=array();
        $datamoi[0]=["cTipo"=>'P',"dCantidadAcon"=>$data[0]['datoacon'],"dCantidadFab"=>$data[0]['datofab'],"dLabpp"=>$data[0]['datolabpp'],"dLabpt"=>$data[0]['datolabpt'],"dLabmp"=>$data[0]['datolabmp'],"idreporteCabecera"=>$id];
        $datamoi[1]=["cTipo"=>'T',"dCantidadAcon"=>$data[1]['datoacon'],"dCantidadFab"=>$data[1]['datofab'],"dLabpp"=>$data[1]['datolabpp'],"dLabpt"=>$data[1]['datolabpt'],"dLabmp"=>$data[1]['datolabmp'],"idreporteCabecera"=>$id];
      
        return $datamoi;

    }

    public function preparardataotros($data=array(),$id){
        foreach($data as $k=>$dat){
            $data[$k]['idreporteCabecera']=$id;
            if($dat['vMaquina']==""){
                unset($data[$k]);
            }
            unset($data[$k]['tipo']);
            unset($data[$k]['idGranel']);
            unset($data[$k]['nPeriodo']);
            unset($data[$k]['nVersion']);
            unset($data[$k]['iEstado']);
            unset($data[$k]['vComentario']);
            unset($data[$k]['vTitulo']);
            unset($data[$k]['idreporteotros']);
        }

        return $data;
    }

    public function preparardatamateria($data=array(),$id){
        foreach($data as $k=>$dat){
            $data[$k]['idreporteCabecera']=$id;
            unset($data[$k]['referencia']);
            unset($data[$k]['diferencia']);
            unset($data[$k]['resultado']);
            unset($data[$k]['idGranel']);
            unset($data[$k]['nPeriodo']);
            unset($data[$k]['iEstado']);
            unset($data[$k]['nVersion']);
            unset($data[$k]['vComentario']);
            unset($data[$k]['vTitulo']);
            //$data[$k]['dCalculo']=number_format($data[$k]['dCalculo'], 10, '.', ' ');
            $data[$k]['iTipo']=1;
            if($dat['codMateria']==''){
                unset($data[$k]);
            }
        }

        return $data;
    }

    public function preparardatamateriaempaque($data=array(),$id){
        foreach($data as $k=>$dat){
            $data[$k]['idreporteCabecera']=$id;
            unset($data[$k]['referencia']);
            unset($data[$k]['diferencia']);
            unset($data[$k]['resultado']);
            unset($data[$k]['idGranel']);
            unset($data[$k]['nPeriodo']);
            unset($data[$k]['iEstado']);
            unset($data[$k]['nVersion']);
            unset($data[$k]['vComentario']);
            unset($data[$k]['vTitulo']);
            //$data[$k]['dCalculo']=number_format($data[$k]['dCalculo'], 10, '.', ' ');
            $data[$k]['iTipo']=2;
            if($dat['codMateria']==''){
                unset($data[$k]);
            }
        }

        return $data;
    }

    public function preparardatamod($datamod=array(),$id){
        foreach($datamod as $k=>$data){
            $datamod[$k]['iTipo']=1;
            $datamod[$k]['idreporteCabecera']=$id;
            if($data['idproceso']==""){
                unset($datamod[$k]);
            }
            unset($datamod[$k]['total']);
            unset($datamod[$k]['unidad']);
            for($i=1;$i<=13;$i++){
                unset($datamod[$k]['proc_'.$i.'']);
            } 
        }

        return $datamod;
    }

    public function preparardatamoi($datamod=array(),$id){
        foreach($datamod as $k=>$data){
            $datamod[$k]['iTipo']=2;
            $datamod[$k]['idreporteCabecera']=$id;
            if($data['idproceso']==""){
                unset($datamod[$k]);
            }
            unset($datamod[$k]['total']);
            unset($datamod[$k]['unidad']);
            for($i=1;$i<=13;$i++){
                unset($datamod[$k]['proc_'.$i.'']);
            } 
        }

        return $datamod;
    }

    public function getCabecera(){
        $granel=$this->input->post('granel');
        $per=$this->input->post('per');
        $ver=$this->input->post('ver');
        $cabecera=$this->mreportecostos->getCabeceragranel($granel,$per,$ver);
        echo json_encode($cabecera);
    }

    public function verificargranel(){
        $granel=$this->input->post('granel');
        $ver=$this->mreportecostos->verificarGranel($granel);
        $data=array();
        if(!empty($ver) && isset($ver)){
            $data['respuesta']=1;
            $data['version']=$ver['nVersion'];
        }else{
            $data['respuesta']=2;
        }

        echo json_encode($data);
    }

    public function listacabeceras(){
        $cabeceras=$this->mreportecostos->listaCabeceras();
        $array_ver=array();
        foreach($cabeceras as $jm=>$version){
            $array_ver[$version['idGranel']]['idreporteCabecera']=$version['idreporteCabecera'];
            $array_ver[$version['idGranel']]['nPeriodo']=$version['nPeriodo'];
            $array_ver[$version['idGranel']]['idGranel']=$version['idGranel'];
            $array_ver[$version['idGranel']]['nVersion']=str_pad($version['nVersion'],5, "0", STR_PAD_LEFT);
            $array_ver[$version['idGranel']]['dfechaModificacion']=$version['dfechaModificacion'];
            $array_ver[$version['idGranel']]['ItemName']=$version['nombregranel'];
        }
        
        echo json_encode($array_ver);
    }

    public function getautorizaciones(){
        $iduser=$this->input->post('iduser');
        $idmenu=$this->input->post('idmenu');
        $autos=$this->mreportecostos->getAutosbyUsuario($iduser,$idmenu);
        echo json_encode($autos); exit;
    }

    public function cargarautorizaciones(){
        $idmenu=$this->input->post('idmenu');
        $info=$this->mreportecostos->cargarinfo($idmenu);
        echo json_encode($info);
    }


    public function getusuarios(){
        $usuarios=$this->mreportecostos->getUsuarios();
        echo json_encode($usuarios);
    }

    public function guardarautorizaciones(){
        $post=$this->input->post();
        $usuarios=$post['usuarios'];
        $datausuarios=array();
        $fecha=date('Y-m-d H:i:s');
        $this->mreportecostos->deleteAutorizaciones($post['idmenu']);
        foreach($usuarios as $jm=>$usuario){
            for($i=0;$i<count($usuario);$i++){
                $datausuarios[$jm][$i]['dFecharegistro']=$fecha;
                $datausuarios[$jm][$i]['idusuarioAut']=$post['iduser'];
                $datausuarios[$jm][$i]['idmenuaccion']=$jm;
                $datausuarios[$jm][$i]['idmenu']=$post['idmenu'];
                $datausuarios[$jm][$i]['idUsuario']=$usuario[$i];
            }
        }
        $datausuarios=array_values($datausuarios);
        for($j=0;$j<count($datausuarios);$j++){
            for($m=0;$m<count($datausuarios[$j]);$m++){
                $this->mreportecostos->guardarAutorizaciones($datausuarios[$j][$m]);
            }      
        }        
    }

    public function getautorizados(){
        $menu=$this->input->post('idmenu');
        $autorizados=$this->mreportecostos->getautorizados($menu);
        echo json_encode($autorizados); exit;
    }

}

?>