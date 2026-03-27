// STAPL Framework Data - Core concepts and educational content

export interface Concept {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  cppEquivalent?: string;
  codeExample?: string;
  relatedConcepts: string[];
  category: "container" | "view" | "algorithm" | "skeleton" | "communication" | "core";
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  abstract: string;
  link?: string;
  tags: string[];
}

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export const concepts: Concept[] = [
  {
    id: "pcontainer",
    title: "pContainer",
    shortDescription: "Parallel distributed container managing data across locations",
    fullDescription: `A pContainer (parallel container) is a distributed data structure that manages data elements across multiple processing locations. Unlike STL containers which exist in a single memory space, pContainers automatically partition data and handle inter-location communication transparently.

Key features:
- Automatic data distribution across locations
- Support for various distribution schemes
- Container-specific parallel operations
- Interoperability with STAPL views and algorithms`,
    cppEquivalent: "std::vector, std::map, etc.",
    codeExample: `// Creating a parallel array with 1000 elements
stapl::array<int> p_arr(1000);

// Fill with values using a parallel algorithm
stapl::generate(stapl::make_array_view(p_arr), 
                stapl::sequence<int>(0));`,
    relatedConcepts: ["pview", "distribution", "location"],
    category: "container",
  },
  {
    id: "pview",
    title: "pView",
    shortDescription: "Parallel view providing abstract interface to pContainers",
    fullDescription: `A pView (parallel view) is an abstraction layer that provides a uniform interface to access data in pContainers. Views enable algorithms to work with different data structures uniformly and support lazy evaluation for improved performance.

Views can be:
- Native views (directly over pContainers)
- Composed views (transformations like zip, filter, reverse)
- Partitioned for workload distribution`,
    cppEquivalent: "Ranges/Views (C++20)",
    codeExample: `// Create a view over a pContainer
auto view = stapl::make_array_view(p_arr);

// Composed views
auto zipped = stapl::zip_view(view1, view2);
auto reversed = stapl::reverse_view(view);`,
    relatedConcepts: ["pcontainer", "algorithm", "composition"],
    category: "view",
  },
  {
    id: "paragraph",
    title: "PARAGRAPH",
    shortDescription: "Task dependency graph for parallel execution",
    fullDescription: `A PARAGRAPH is STAPL's runtime representation of a parallel computation as a directed acyclic graph (DAG). Each node represents a task, and edges represent data dependencies between tasks.

The PARAGRAPH runtime:
- Dynamically schedules tasks based on dependencies
- Handles inter-location communication
- Supports nested parallelism
- Enables automatic load balancing`,
    codeExample: `// PARAGRAPHs are typically created implicitly
// when calling algorithms or skeletons

// Explicit PARAGRAPH usage
stapl::paragraph<...> pg(task_factory);
pg();  // Execute the parallel computation`,
    relatedConcepts: ["skeleton", "task", "workfunction"],
    category: "core",
  },
  {
    id: "skeleton",
    title: "Algorithmic Skeleton",
    shortDescription: "High-level parallel pattern templates",
    fullDescription: `Algorithmic skeletons are parameterized parallel patterns that capture common computation structures. They abstract away the details of parallel execution, allowing programmers to focus on the computation logic.

Common skeletons in STAPL:
- map: Apply function to each element
- reduce: Combine elements to single value
- scan: Prefix computations
- zip: Process multiple sequences together
- compose: Chain skeletons together`,
    codeExample: `// Map skeleton - apply function to each element
auto doubled = stapl::map_func(
  [](int x) { return x * 2; }, 
  view
);

// Reduce skeleton - sum all elements
auto sum = stapl::reduce(view, stapl::plus<int>());

// Compose skeletons
auto result = stapl::compose(
  stapl::map_func(square),
  stapl::reduce(stapl::plus<int>())
)(view);`,
    relatedConcepts: ["paragraph", "workfunction", "algorithm"],
    category: "skeleton",
  },
  {
    id: "location",
    title: "Location",
    shortDescription: "Abstract processing unit in STAPL",
    fullDescription: `A location is STAPL's abstraction for a processing unit. It represents a unit of parallel execution that owns a portion of distributed data and executes tasks. Locations can map to:

- A single thread
- A group of threads
- A process in distributed memory
- A mixed configuration

This abstraction allows STAPL programs to run unchanged on different parallel architectures.`,
    relatedConcepts: ["pcontainer", "distribution", "rmi"],
    category: "core",
  },
  {
    id: "distribution",
    title: "Distribution",
    shortDescription: "Strategy for partitioning data across locations",
    fullDescription: `A distribution determines how data elements are assigned to locations. STAPL supports various distribution strategies:

- Block distribution: Contiguous chunks to each location
- Cyclic distribution: Round-robin element assignment
- Block-cyclic: Blocks assigned cyclically
- Custom distributions: User-defined mappings

The distribution affects communication patterns and load balance.`,
    codeExample: `// Block distribution (default)
stapl::array<int> p_arr(1000);

// Explicit cyclic distribution
stapl::array<int> cyclic_arr(1000, 
  stapl::cyclic_partition(num_locations));`,
    relatedConcepts: ["pcontainer", "location", "partition"],
    category: "core",
  },
  {
    id: "workfunction",
    title: "Work Function",
    shortDescription: "Encapsulated unit of sequential computation",
    fullDescription: `A work function is a callable object that encapsulates a unit of sequential computation to be executed as part of a parallel algorithm. Work functions are the building blocks of STAPL tasks.

Requirements:
- Must be serializable (for distribution)
- Should be stateless or carefully manage state
- Define operator() for execution`,
    cppEquivalent: "Function objects, lambdas",
    codeExample: `// Simple work function
struct square_wf {
  template<typename T>
  T operator()(T x) const {
    return x * x;
  }
};

// Using lambda as work function
stapl::map_func([](auto x) { return x * 2; }, view);`,
    relatedConcepts: ["skeleton", "paragraph", "task"],
    category: "core",
  },
  {
    id: "rmi",
    title: "Remote Method Invocation (RMI)",
    shortDescription: "Communication mechanism between locations",
    fullDescription: `RMI (Remote Method Invocation) is STAPL's communication layer that enables locations to invoke methods on distributed objects. It provides:

- Synchronous RMI: Blocking call with return value
- Asynchronous RMI: Non-blocking, fire-and-forget
- One-sided communication
- Automatic serialization of arguments

RMI abstracts the underlying communication (MPI, threads, etc.).`,
    codeExample: `// Asynchronous RMI (non-blocking)
stapl::async_rmi(target_location, handle, 
                  &object_type::method, args...);

// Synchronous RMI (blocking with return)
auto result = stapl::sync_rmi(target_location, handle,
                               &object_type::method, args...);`,
    relatedConcepts: ["location", "distribution", "communication"],
    category: "communication",
  },
  {
    id: "algorithm",
    title: "Parallel Algorithm",
    shortDescription: "STL-like algorithms for distributed data",
    fullDescription: `STAPL provides parallel versions of STL algorithms that work on pViews. These algorithms automatically:

- Partition work across locations
- Generate PARAGRAPHs for execution
- Handle communication for global operations
- Maintain the same interface as STL

Available algorithms include transform, reduce, find, sort, accumulate, copy, and many more.`,
    cppEquivalent: "std::transform, std::reduce, etc.",
    codeExample: `// Parallel transform
stapl::transform(input_view, output_view, 
                 [](int x) { return x * 2; });

// Parallel reduce
int sum = stapl::accumulate(view, 0);

// Parallel sort
stapl::sort(view);

// Parallel find
auto it = stapl::find(view, target_value);`,
    relatedConcepts: ["pview", "skeleton", "paragraph"],
    category: "algorithm",
  },
  {
    id: "composition",
    title: "View Composition",
    shortDescription: "Combining views for complex data access patterns",
    fullDescription: `View composition allows creating complex data access patterns by combining simpler views. This enables:

- Lazy evaluation (no intermediate copies)
- Expression of complex algorithms
- Reusable view transformations
- Efficient memory usage

Common compositions: zip (pair elements), filter (conditional access), reverse, segment.`,
    codeExample: `// Zip two views together
auto paired = stapl::zip_view(view1, view2);

// Process paired elements
stapl::for_each(paired, [](auto pair) {
  auto [a, b] = pair;
  // work with a and b together
});

// Chain multiple transformations
auto result = view 
  | stapl::filter(is_positive)
  | stapl::transform(square);`,
    relatedConcepts: ["pview", "algorithm", "skeleton"],
    category: "view",
  },
];

export const researchPapers: ResearchPaper[] = [
  {
    id: "stapl-original",
    title: "STAPL: Standard Template Adaptive Parallel Library",
    authors: ["L. Rauchwerger", "et al."],
    year: 2010,
    venue: "LCPC Workshop",
    abstract: "Introduction of STAPL as a parallel programming framework that extends STL concepts to distributed memory systems.",
    tags: ["foundational", "architecture", "overview"],
  },
  {
    id: "pcontainers",
    title: "The STAPL Parallel Container Framework",
    authors: ["G. Tanase", "A. Buss", "A. Fidel", "et al."],
    year: 2011,
    venue: "PPoPP",
    abstract: "Detailed description of the pContainer framework, including design principles, implementation strategies, and performance evaluation on various parallel architectures.",
    tags: ["containers", "implementation", "performance"],
  },
  {
    id: "pviews",
    title: "The STAPL pView",
    authors: ["A. Buss", "Harshvardhan", "I. Papadopoulos", "et al."],
    year: 2010,
    venue: "LCPC Workshop",
    abstract: "Introduces the pView abstraction for providing uniform access to distributed data structures while supporting various data access patterns.",
    tags: ["views", "abstraction", "data-access"],
  },
  {
    id: "paragraph",
    title: "PARAGRAPH: A Runtime Interface for the Scalable Execution of Parallel Programs",
    authors: ["A. Fidel", "S. Siu", "et al."],
    year: 2014,
    venue: "SC Conference",
    abstract: "Describes the PARAGRAPH runtime system that dynamically schedules tasks based on data dependencies for efficient parallel execution.",
    tags: ["runtime", "scheduling", "scalability"],
  },
  {
    id: "skeletons-stapl",
    title: "Algorithmic Skeletons in STAPL",
    authors: ["M. Zandifar", "et al."],
    year: 2014,
    venue: "HPDC",
    abstract: "Presents the design and implementation of algorithmic skeletons in STAPL, showing how common parallel patterns can be composed to express complex computations.",
    tags: ["skeletons", "patterns", "composition"],
  },
  {
    id: "nested-parallelism",
    title: "Nested Parallelism in STAPL",
    authors: ["Harshvardhan", "A. Fidel", "et al."],
    year: 2015,
    venue: "IPDPS",
    abstract: "Explores techniques for supporting nested parallel constructs in STAPL, enabling hierarchical parallelism for irregular applications.",
    tags: ["nested", "hierarchical", "irregular"],
  },
  {
    id: "stapl-graph",
    title: "STAPL Graph Library",
    authors: ["Harshvardhan", "A. Fidel", "et al."],
    year: 2013,
    venue: "IPDPS",
    abstract: "Introduces the parallel graph container and algorithms in STAPL, demonstrating scalability on large-scale graph problems.",
    tags: ["graphs", "containers", "scalability"],
  },
];

export const flashCards: FlashCard[] = [
  {
    id: "fc1",
    question: "What is the main difference between a pContainer and an STL container?",
    answer: "A pContainer distributes data across multiple locations (processing units) and handles parallel access automatically, while STL containers exist in a single memory space.",
    category: "containers",
    difficulty: "beginner",
  },
  {
    id: "fc2",
    question: "What is a pView and why is it important?",
    answer: "A pView is an abstraction layer that provides uniform access to pContainer data. It enables algorithms to work with different data structures uniformly, supports lazy evaluation, and allows view composition for complex data access patterns.",
    category: "views",
    difficulty: "beginner",
  },
  {
    id: "fc3",
    question: "What is a PARAGRAPH in STAPL?",
    answer: "A PARAGRAPH is a directed acyclic graph (DAG) representing a parallel computation. Nodes are tasks, edges are dependencies. The PARAGRAPH runtime dynamically schedules tasks based on dependencies and handles communication.",
    category: "runtime",
    difficulty: "intermediate",
  },
  {
    id: "fc4",
    question: "Name three common algorithmic skeletons in STAPL.",
    answer: "Map (apply function to each element), Reduce (combine elements to single value), and Scan (prefix computations). Others include zip, compose, and broadcast.",
    category: "skeletons",
    difficulty: "beginner",
  },
  {
    id: "fc5",
    question: "What is a location in STAPL?",
    answer: "A location is an abstract processing unit that owns a portion of distributed data and executes tasks. It can map to a thread, group of threads, or process, enabling programs to run unchanged on different architectures.",
    category: "core",
    difficulty: "beginner",
  },
  {
    id: "fc6",
    question: "What is the difference between synchronous and asynchronous RMI?",
    answer: "Synchronous RMI blocks until the remote method completes and returns a value. Asynchronous RMI is non-blocking (fire-and-forget) and does not wait for completion.",
    category: "communication",
    difficulty: "intermediate",
  },
  {
    id: "fc7",
    question: "What are the benefits of view composition?",
    answer: "View composition enables lazy evaluation (no intermediate copies), expression of complex algorithms, reusable view transformations, and efficient memory usage.",
    category: "views",
    difficulty: "intermediate",
  },
  {
    id: "fc8",
    question: "What is a work function in STAPL?",
    answer: "A work function is a serializable callable object that encapsulates a unit of sequential computation. It must define operator() and is the building block of STAPL tasks.",
    category: "core",
    difficulty: "intermediate",
  },
  {
    id: "fc9",
    question: "Name three distribution strategies in STAPL.",
    answer: "Block distribution (contiguous chunks), cyclic distribution (round-robin), and block-cyclic distribution. Custom distributions can also be defined.",
    category: "distribution",
    difficulty: "intermediate",
  },
  {
    id: "fc10",
    question: "How does STAPL achieve portability across different parallel architectures?",
    answer: "Through abstractions like locations (abstract processing units), the ARMI communication layer, and configurable distributions. Programs written using these abstractions can run on shared memory, distributed memory, or hybrid systems without modification.",
    category: "core",
    difficulty: "advanced",
  },
  {
    id: "fc11",
    question: "What is the relationship between skeletons and PARAGRAPHs?",
    answer: "Skeletons are high-level parallel patterns that, when executed, generate PARAGRAPHs. The skeleton defines the structure of computation, while the PARAGRAPH is the runtime representation used for scheduling and execution.",
    category: "skeletons",
    difficulty: "advanced",
  },
  {
    id: "fc12",
    question: "Why does STAPL use the term 'location' instead of 'processor' or 'thread'?",
    answer: "Location is an abstraction that decouples the programming model from the hardware. A location can represent any granularity of parallelism, making STAPL programs portable across different parallel configurations.",
    category: "core",
    difficulty: "intermediate",
  },
];

export const cppToStaplMapping = [
  {
    cpp: "std::vector<T>",
    stapl: "stapl::array<T>",
    notes: "Distributed array with configurable partitioning",
  },
  {
    cpp: "std::map<K,V>",
    stapl: "stapl::map<K,V>",
    notes: "Distributed associative container",
  },
  {
    cpp: "std::list<T>",
    stapl: "stapl::list<T>",
    notes: "Distributed linked list",
  },
  {
    cpp: "std::transform",
    stapl: "stapl::transform / map skeleton",
    notes: "Parallel element-wise transformation",
  },
  {
    cpp: "std::accumulate",
    stapl: "stapl::accumulate / reduce skeleton",
    notes: "Parallel reduction operation",
  },
  {
    cpp: "std::sort",
    stapl: "stapl::sort",
    notes: "Parallel sorting algorithm",
  },
  {
    cpp: "std::find",
    stapl: "stapl::find",
    notes: "Parallel search operation",
  },
  {
    cpp: "std::for_each",
    stapl: "stapl::for_each / map skeleton",
    notes: "Parallel iteration",
  },
  {
    cpp: "Iterators",
    stapl: "pViews",
    notes: "Abstract data access, support composition",
  },
  {
    cpp: "Function objects",
    stapl: "Work functions",
    notes: "Must be serializable for distribution",
  },
];

// Graph data for memory model visualization
export interface MemoryNode {
  id: string;
  label: string;
  type: "location" | "data" | "task" | "communication";
  x?: number;
  y?: number;
}

export interface MemoryLink {
  source: string;
  target: string;
  type: "owns" | "communicates" | "depends";
}

export const memoryModelData = {
  nodes: [
    { id: "loc0", label: "Location 0", type: "location" as const },
    { id: "loc1", label: "Location 1", type: "location" as const },
    { id: "loc2", label: "Location 2", type: "location" as const },
    { id: "loc3", label: "Location 3", type: "location" as const },
    { id: "data0", label: "Data[0-249]", type: "data" as const },
    { id: "data1", label: "Data[250-499]", type: "data" as const },
    { id: "data2", label: "Data[500-749]", type: "data" as const },
    { id: "data3", label: "Data[750-999]", type: "data" as const },
  ],
  links: [
    { source: "loc0", target: "data0", type: "owns" as const },
    { source: "loc1", target: "data1", type: "owns" as const },
    { source: "loc2", target: "data2", type: "owns" as const },
    { source: "loc3", target: "data3", type: "owns" as const },
    { source: "loc0", target: "loc1", type: "communicates" as const },
    { source: "loc1", target: "loc2", type: "communicates" as const },
    { source: "loc2", target: "loc3", type: "communicates" as const },
    { source: "loc3", target: "loc0", type: "communicates" as const },
  ],
};

// Skeleton composition visualization data
export interface SkeletonStep {
  name: string;
  description: string;
  input: string[];
  output: string[];
  operation: string;
}

export const skeletonCompositionSteps: SkeletonStep[] = [
  {
    name: "Input Data",
    description: "Initial distributed array",
    input: ["[1, 2, 3, 4]", "[5, 6, 7, 8]", "[9, 10, 11, 12]", "[13, 14, 15, 16]"],
    output: ["[1, 2, 3, 4]", "[5, 6, 7, 8]", "[9, 10, 11, 12]", "[13, 14, 15, 16]"],
    operation: "distribute",
  },
  {
    name: "Map (square)",
    description: "Apply square to each element",
    input: ["[1, 2, 3, 4]", "[5, 6, 7, 8]", "[9, 10, 11, 12]", "[13, 14, 15, 16]"],
    output: ["[1, 4, 9, 16]", "[25, 36, 49, 64]", "[81, 100, 121, 144]", "[169, 196, 225, 256]"],
    operation: "map",
  },
  {
    name: "Local Reduce",
    description: "Sum elements at each location",
    input: ["[1, 4, 9, 16]", "[25, 36, 49, 64]", "[81, 100, 121, 144]", "[169, 196, 225, 256]"],
    output: ["30", "174", "446", "846"],
    operation: "local_reduce",
  },
  {
    name: "Global Reduce",
    description: "Combine local results",
    input: ["30", "174", "446", "846"],
    output: ["1496"],
    operation: "global_reduce",
  },
];
