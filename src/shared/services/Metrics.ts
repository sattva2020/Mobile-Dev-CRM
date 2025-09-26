/**
 * Metrics - Система сбора метрик для мониторинга
 * Поддерживает различные типы метрик и отправку в Prometheus
 */
export interface MetricValue {
  value: number;
  labels?: Record<string, string>;
  timestamp?: number;
}

export interface CounterMetric {
  name: string;
  help: string;
  labels: string[];
  value: number;
}

export interface GaugeMetric {
  name: string;
  help: string;
  labels: string[];
  value: number;
}

export interface HistogramMetric {
  name: string;
  help: string;
  labels: string[];
  buckets: number[];
  count: number;
  sum: number;
  buckets_count: Record<string, number>;
}

export class MetricsCollector {
  private counters: Map<string, CounterMetric> = new Map();
  private gauges: Map<string, GaugeMetric> = new Map();
  private histograms: Map<string, HistogramMetric> = new Map();
  private endpoint?: string;

  constructor(endpoint?: string) {
    this.endpoint = endpoint;
  }

  // Counter metrics
  public createCounter(name: string, help: string, labels: string[] = []): void {
    this.counters.set(name, {
      name,
      help,
      labels,
      value: 0
    });
  }

  public incrementCounter(name: string, labels: Record<string, string> = {}, value: number = 1): void {
    const counter = this.counters.get(name);
    if (counter) {
      counter.value += value;
      this.sendMetric('counter', name, value, labels);
    }
  }

  // Gauge metrics
  public createGauge(name: string, help: string, labels: string[] = []): void {
    this.gauges.set(name, {
      name,
      help,
      labels,
      value: 0
    });
  }

  public setGauge(name: string, value: number, labels: Record<string, string> = {}): void {
    const gauge = this.gauges.get(name);
    if (gauge) {
      gauge.value = value;
      this.sendMetric('gauge', name, value, labels);
    }
  }

  public incrementGauge(name: string, labels: Record<string, string> = {}, value: number = 1): void {
    const gauge = this.gauges.get(name);
    if (gauge) {
      gauge.value += value;
      this.sendMetric('gauge', name, gauge.value, labels);
    }
  }

  public decrementGauge(name: string, labels: Record<string, string> = {}, value: number = 1): void {
    const gauge = this.gauges.get(name);
    if (gauge) {
      gauge.value -= value;
      this.sendMetric('gauge', name, gauge.value, labels);
    }
  }

  // Histogram metrics
  public createHistogram(name: string, help: string, buckets: number[], labels: string[] = []): void {
    this.histograms.set(name, {
      name,
      help,
      labels,
      buckets,
      count: 0,
      sum: 0,
      buckets_count: {}
    });
  }

  public observeHistogram(name: string, value: number, labels: Record<string, string> = {}): void {
    const histogram = this.histograms.get(name);
    if (histogram) {
      histogram.count++;
      histogram.sum += value;
      
      // Update bucket counts
      for (const bucket of histogram.buckets) {
        if (value <= bucket) {
          const bucketKey = `le_${bucket}`;
          histogram.buckets_count[bucketKey] = (histogram.buckets_count[bucketKey] || 0) + 1;
        }
      }
      
      this.sendMetric('histogram', name, value, labels);
    }
  }

  private async sendMetric(
    type: string,
    name: string,
    value: number,
    labels: Record<string, string>
  ): Promise<void> {
    if (!this.endpoint) {
      return;
    }

    try {
      const metric = {
        type,
        name,
        value,
        labels,
        timestamp: Date.now()
      };

      await fetch(`${this.endpoint}/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.error('Failed to send metric:', error);
    }
  }

  // HTTP request metrics
  public recordHttpRequest(method: string, path: string, status: number, duration: number): void {
    this.incrementCounter('http_requests_total', { method, path, status: status.toString() });
    this.observeHistogram('http_request_duration_seconds', duration / 1000, { method, path });
  }

  // Database metrics
  public recordDatabaseQuery(query: string, duration: number, success: boolean): void {
    this.incrementCounter('database_queries_total', { query, success: success.toString() });
    this.observeHistogram('database_query_duration_seconds', duration / 1000, { query });
  }

  // Authentication metrics
  public recordAuthAttempt(success: boolean, method: string): void {
    this.incrementCounter('auth_attempts_total', { success: success.toString(), method });
  }

  // Business metrics
  public recordTaskCreated(priority: string, category: string): void {
    this.incrementCounter('tasks_created_total', { priority, category });
  }

  public recordTaskCompleted(priority: string, category: string, duration: number): void {
    this.incrementCounter('tasks_completed_total', { priority, category });
    this.observeHistogram('task_completion_duration_seconds', duration / 1000, { priority, category });
  }

  public recordProjectCreated(): void {
    this.incrementCounter('projects_created_total');
  }

  public recordProjectCompleted(duration: number): void {
    this.incrementCounter('projects_completed_total');
    this.observeHistogram('project_completion_duration_seconds', duration / 1000);
  }

  // System metrics
  public recordMemoryUsage(usage: number): void {
    this.setGauge('memory_usage_bytes', usage);
  }

  public recordCPUUsage(usage: number): void {
    this.setGauge('cpu_usage_percent', usage);
  }

  public recordDiskUsage(usage: number): void {
    this.setGauge('disk_usage_percent', usage);
  }

  // Get all metrics for Prometheus format
  public getPrometheusMetrics(): string {
    let output = '';

    // Counters
    for (const [name, counter] of Array.from(this.counters.entries())) {
      output += `# HELP ${name} ${counter.help}\n`;
      output += `# TYPE ${name} counter\n`;
      output += `${name} ${counter.value}\n`;
    }

    // Gauges
    for (const [name, gauge] of Array.from(this.gauges.entries())) {
      output += `# HELP ${name} ${gauge.help}\n`;
      output += `# TYPE ${name} gauge\n`;
      output += `${name} ${gauge.value}\n`;
    }

    // Histograms
    for (const [name, histogram] of Array.from(this.histograms.entries())) {
      output += `# HELP ${name} ${histogram.help}\n`;
      output += `# TYPE ${name} histogram\n`;
      
      for (const [bucket, count] of Object.entries(histogram.buckets_count)) {
        output += `${name}_bucket{le="${bucket}"} ${count}\n`;
      }
      
      output += `${name}_count ${histogram.count}\n`;
      output += `${name}_sum ${histogram.sum}\n`;
    }

    return output;
  }
}

// Глобальный экземпляр коллектора метрик
export const metricsCollector = new MetricsCollector(
  process.env.METRICS_ENDPOINT
);

// Инициализация стандартных метрик
metricsCollector.createCounter('http_requests_total', 'Total HTTP requests', ['method', 'path', 'status']);
metricsCollector.createHistogram('http_request_duration_seconds', 'HTTP request duration', [0.1, 0.5, 1, 2, 5], ['method', 'path']);
metricsCollector.createCounter('database_queries_total', 'Total database queries', ['query', 'success']);
metricsCollector.createHistogram('database_query_duration_seconds', 'Database query duration', [0.01, 0.05, 0.1, 0.5, 1], ['query']);
metricsCollector.createCounter('auth_attempts_total', 'Total authentication attempts', ['success', 'method']);
metricsCollector.createCounter('tasks_created_total', 'Total tasks created', ['priority', 'category']);
metricsCollector.createCounter('tasks_completed_total', 'Total tasks completed', ['priority', 'category']);
metricsCollector.createHistogram('task_completion_duration_seconds', 'Task completion duration', [1, 7, 30, 90, 365], ['priority', 'category']);
metricsCollector.createCounter('projects_created_total', 'Total projects created');
metricsCollector.createCounter('projects_completed_total', 'Total projects completed');
metricsCollector.createHistogram('project_completion_duration_seconds', 'Project completion duration', [7, 30, 90, 365, 730]);
metricsCollector.createGauge('memory_usage_bytes', 'Memory usage in bytes');
metricsCollector.createGauge('cpu_usage_percent', 'CPU usage percentage');
metricsCollector.createGauge('disk_usage_percent', 'Disk usage percentage');
