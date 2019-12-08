<html>
<h1>Javascript Traffic Counter</h1>
Type
<input type="button" value="Pedestrian" id="Pedestrian">
<input type="button" value="Bicycle" id="Bicycle">
<input type="button" value="Car" id="Car">
<input type="button" value="Truck" id="Truck">
<input type="button" value="Bus" id="Bus">
<input type="button" value="Dog" id="Dog">
<br>Origin
<input type="button" value="North" id="North">
<input type="button" value="South" id="South">
<input type="button" value="East" id="East">
<input type="button" value="West" id="West">
<br>Destination
<input type="button" value="North" id="dNorth">
<input type="button" value="South" id="dSouth">
<input type="button" value="East" id="dEast">
<input type="button" value="West" id="dWest">
<hr>
<div id="csv">Date,Type,Origin,Destination</div>
 <script type="text/javascript">  
  types = ["Pedestrian","Bicycle","Car","Truck","Bus","Dog"]
  function resetTypeColors() {
    for (i = 0; i < types.length; i++) {
      document.getElementById(types[i]).style.background='#FFFFFF';
    }
  }
  function selectType() {
    type = this.id;
    resetTypeColors();
    document.getElementById(this.id).style.background='#888888';
  }
  for (i = 0; i < types.length; i++) {
    document.getElementById(types[i]).addEventListener('click',selectType,false);
  }
  origins = ["North","South","East","West"]
  function resetOriginColors() {
    for (i = 0; i < origins.length; i++) {
      document.getElementById(origins[i]).style.background='#FFFFFF';
    }
  }
  function selectOrigin() {
    origin = this.id;
    resetOriginColors();
    document.getElementById(this.id).style.background='#888888';
  }
  for (i = 0; i < origins.length; i++) {
    document.getElementById(origins[i]).addEventListener('click',selectOrigin,false);
  }
  destinations = ["dNorth","dSouth","dEast","dWest"]
  function selectDestination() {
    destination = this.id.split("d")[1];
    var newElement = document.createElement('div');
    newElement.innerHTML = Date() + "," + type + "," + origin + "," + destination;
    document.getElementById("csv").appendChild(newElement);
  }
  for (i = 0; i < destinations.length; i++) {
    document.getElementById(destinations[i]).addEventListener('click',selectDestination,false);
  }
</script>
</html>
