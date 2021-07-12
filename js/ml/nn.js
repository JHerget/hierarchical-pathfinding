class ActivationFunction {
  constructor(func, dfunc){
    this.func = func;
    this.dfunc = dfunc;
  }
}

//common activation function.
let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

class NeuralNetwork {
  //takes 3 integers or 1 neural network
  constructor(input_nodes, hidden_nodes, output_nodes){
    if(input_nodes instanceof NeuralNetwork){
      let a = input_nodes;
      //set the amount of nodes in each layer
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      //create and randomize the weight matrix for each layer
      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();

      //create and randomize the bias matrix for each layer
      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
    }else{
      //set the amount of nodes in each layer
      this.input_nodes = input_nodes;
      this.hidden_nodes = hidden_nodes;
      this.output_nodes = output_nodes;

      //create and randomize the weight matrix for each layer
      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();

      //create and randomize the bias matrix for each layer
      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
    }

    //set learning rate and activation function for the network
    this.setLearningRate(); //default 0.1
    this.setActivationFunction(); //default sigmoid
  }

  setLearningRate(learning_rate = 0.1){
    this.learning_rate = learning_rate;
  }

  setActivationFunction(activation_function = sigmoid){
    this.activation_function = activation_function;
  }

  //feeds input forward and returns the output
  //takes and returns an array
  predict(input_array){
    //convert input array to a matrix
    let inputs = Matrix.fromArray(input_array);

    //get hidden output
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(this.activation_function.func);

    //get output output
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    return output.toArray();
  }

  //feeds forward then backpropagates
  train(input_array, target_array){
    //convert input array to a matrix
    let inputs = Matrix.fromArray(input_array);

    //covert target array to a matrix
    let targets = Matrix.fromArray(target_array);

    //get hidden output
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(this.activation_function.func);

    //get output output
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    //get error
    //ERROR = TARGET - OUTPUT
    let output_errors = Matrix.subtract(targets, output);

    //calculate gradient
    let output_gradient = Matrix.map(output, this.activation_function.dfunc);
    output_gradient.multiply(output_errors);
    output_gradient.multiply(this.learning_rate);

    //calculate output deltas
    let hidden_T = Matrix.transpose(hidden);
    let weights_ho_deltas = Matrix.multiply(output_gradient, hidden_T);

    //change hidden->output weights and bias
    this.weights_ho.add(weights_ho_deltas);
    this.bias_o.add(output_gradient);

    //calculate hidden errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    //calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);

    //calculate hidden deltas
    let input_T = Matrix.transpose(inputs);
    let weights_ih_deltas = Matrix.multiply(hidden_gradient, input_T);

    //change input->hidden weights and bias
    this.weights_ih.add(weights_ih_deltas);
    this.bias_h.add(hidden_gradient);
  }

  serialize(){
    return JSON.stringify(this);
  }

  static deserialize(data){
    if(data == "string"){
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }

  copy(){
    return new NeuralNetwork(this);
  }

  mutate(func){
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
  }
}










































































//need me some whitespace
