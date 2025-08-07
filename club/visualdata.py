# visualdata.py
# Sistema de Visualización Profesional para Proyectos de Investigación Matemática
# Prof. Yonatan Guerrero Soriano
# Versión Mejorada - Completamente autónoma para generación de gráficas

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Rectangle, Circle
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# ===========================================
# CONFIGURACIÓN GLOBAL PROFESIONAL
# ===========================================

# Configurar estilo profesional
plt.style.use('default')
sns.set_palette("husl")

# Configuración de matplotlib para gráficas profesionales
plt.rcParams.update({
    'figure.figsize': (12, 8),
    'figure.dpi': 100,
    'savefig.dpi': 300,
    'font.size': 12,
    'axes.labelsize': 14,
    'axes.titlesize': 16,
    'xtick.labelsize': 12,
    'ytick.labelsize': 12,
    'legend.fontsize': 12,
    'font.family': 'sans-serif',
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.grid': True,
    'grid.alpha': 0.3,
    'grid.linestyle': '--',
    'lines.linewidth': 2.5,
    'lines.markersize': 8,
    'patch.edgecolor': 'black',
    'patch.linewidth': 0.5,
    'axes.prop_cycle': plt.cycler('color', ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#592E83', '#F7931E', '#92C5DE', '#F4A460'])
})

# ===========================================
# PROCESAMIENTO DE DATOS
# ===========================================

class DataProcessor:
    """Clase para procesar y validar datos de entrada"""
    
    @staticmethod
    def process_data(chart_data):
        """
        Procesa los datos de entrada y los convierte en arrays numpy
        
        Args:
            chart_data (str): Datos en formato CSV o pares x,y separados por ;
        
        Returns:
            tuple: (x_data, y_data) o (data,) para datos unidimensionales
        """
        try:
            if not chart_data or chart_data.strip() == "":
                raise ValueError("Los datos están vacíos")
            
            if ';' in chart_data:
                # Datos bidimensionales (x,y pairs)
                pairs = [pair.split(',') for pair in chart_data.split(';')]
                x_data = []
                y_data = []
                
                for pair in pairs:
                    if len(pair) >= 2:
                        try:
                            x_val = float(pair[0].strip())
                            y_val = float(pair[1].strip())
                            x_data.append(x_val)
                            y_data.append(y_val)
                        except ValueError:
                            continue
                
                if len(x_data) == 0:
                    raise ValueError("No se pudieron procesar los pares de datos")
                
                return np.array(x_data), np.array(y_data)
            else:
                # Datos unidimensionales
                data_list = []
                for x in chart_data.split(','):
                    if x.strip():
                        try:
                            data_list.append(float(x.strip()))
                        except ValueError:
                            continue
                
                if len(data_list) == 0:
                    raise ValueError("No se pudieron procesar los datos")
                
                return (np.array(data_list),)
                
        except Exception as e:
            print(f"❌ Error procesando datos: {e}")
            return None
    
    @staticmethod
    def process_labels(chart_labels):
        """Procesa las etiquetas de entrada"""
        if not chart_labels or chart_labels.strip() == "":
            return None
        
        labels = [label.strip() for label in chart_labels.split(',') if label.strip()]
        return labels if labels else None
    
    @staticmethod
    def validate_data_for_chart_type(data_result, chart_type):
        """Valida que los datos sean apropiados para el tipo de gráfica"""
        if not data_result:
            return False
        
        if chart_type in ['line', 'scatter'] and len(data_result) == 1:
            # Para líneas y scatter, si solo hay una dimensión, está bien
            return len(data_result[0]) >= 2
        elif chart_type in ['bar', 'pie'] and len(data_result) == 1:
            # Para barras y pie, necesitamos al menos un dato
            return len(data_result[0]) >= 1
        elif chart_type in ['histogram', 'box'] and len(data_result) == 1:
            # Para histograma y box, necesitamos varios datos
            return len(data_result[0]) >= 3
        
        return True

# ===========================================
# GENERADORES DE GRÁFICAS PROFESIONALES
# ===========================================

class ProfessionalCharts:
    """Clase principal para generar gráficas profesionales"""
    
    def __init__(self):
        self.processor = DataProcessor()
    
    def create_line_chart(self, chart_data, chart_labels, chart_title):
        """Crea una gráfica de líneas profesional con análisis avanzado"""
        data_result = self.processor.process_data(chart_data)
        if not data_result:
            return False
        
        fig, ax = plt.subplots(figsize=(12, 8))
        
        if len(data_result) == 2:
            x_data, y_data = data_result
            
            # Gráfica principal
            line = ax.plot(x_data, y_data, marker='o', linewidth=3, markersize=8, 
                          markerfacecolor='white', markeredgewidth=2, alpha=0.8, 
                          label='Datos')[0]
            
            # Línea de tendencia
            if len(x_data) > 1:
                z = np.polyfit(x_data, y_data, 1)
                p = np.poly1d(z)
                ax.plot(x_data, p(x_data), "--", alpha=0.7, color='red', 
                       linewidth=2, label=f'Tendencia: y = {z[0]:.3f}x + {z[1]:.3f}')
            
            # Calcular y mostrar correlación
            if len(x_data) > 1:
                correlation = np.corrcoef(x_data, y_data)[0, 1]
                ax.text(0.05, 0.95, f'Correlación: {correlation:.3f}', 
                       transform=ax.transAxes, fontsize=12, 
                       bbox=dict(boxstyle="round,pad=0.3", facecolor='lightblue', alpha=0.7))
            
            ax.set_xlabel('X', fontweight='bold', fontsize=14)
            ax.set_ylabel('Y', fontweight='bold', fontsize=14)
            
        else:
            data = data_result[0]
            x_indices = np.arange(len(data))
            
            line = ax.plot(x_indices, data, marker='o', linewidth=3, markersize=8,
                          markerfacecolor='white', markeredgewidth=2, alpha=0.8)[0]
            
            # Añadir línea de promedio
            mean_val = np.mean(data)
            ax.axhline(y=mean_val, color='red', linestyle='--', alpha=0.7, 
                      label=f'Promedio: {mean_val:.2f}')
            
            ax.set_xlabel('Índice', fontweight='bold', fontsize=14)
            ax.set_ylabel('Valor', fontweight='bold', fontsize=14)
            
            # Configurar etiquetas si están disponibles
            labels = self.processor.process_labels(chart_labels)
            if labels and len(labels) >= len(data):
                ax.set_xticks(x_indices)
                ax.set_xticklabels(labels[:len(data)], rotation=45, ha='right')
        
        ax.set_title(chart_title or 'Gráfica de Líneas Profesional', 
                    fontweight='bold', fontsize=16, pad=20)
        ax.legend()
        ax.grid(True, alpha=0.3, linestyle='--')
        
        plt.tight_layout()
        plt.show()
        return True
    
    def create_bar_chart(self, chart_data, chart_labels, chart_title):
        """Crea una gráfica de barras profesional con estadísticas"""
        data_result = self.processor.process_data(chart_data)
        if not data_result:
            return False
        
        fig, ax = plt.subplots(figsize=(12, 8))
        
        if len(data_result) == 2:
            x_data, y_data = data_result
            x_pos = range(len(x_data))
            
            # Crear barras con gradiente de colores
            colors = plt.cm.viridis(np.linspace(0, 1, len(y_data)))
            bars = ax.bar(x_pos, y_data, alpha=0.8, color=colors, 
                         edgecolor='black', linewidth=0.8)
            
            # Configurar etiquetas X
            labels = self.processor.process_labels(chart_labels)
            if labels and len(labels) >= len(x_data):
                ax.set_xticks(x_pos)
                ax.set_xticklabels(labels[:len(x_data)], rotation=45, ha='right')
            else:
                ax.set_xticks(x_pos)
                ax.set_xticklabels([f'X={x:.1f}' for x in x_data], rotation=45, ha='right')
            
            data_for_stats = y_data
        else:
            data = data_result[0]
            x_pos = range(len(data))
            
            # Crear barras con gradiente de colores
            colors = plt.cm.viridis(np.linspace(0, 1, len(data)))
            bars = ax.bar(x_pos, data, alpha=0.8, color=colors, 
                         edgecolor='black', linewidth=0.8)
            
            # Configurar etiquetas
            labels = self.processor.process_labels(chart_labels)
            if labels and len(labels) >= len(data):
                ax.set_xticks(x_pos)
                ax.set_xticklabels(labels[:len(data)], rotation=45, ha='right')
            
            data_for_stats = data
        
        # Agregar valores en las barras
        for i, bar in enumerate(bars):
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + height*0.01,
                   f'{height:.1f}', ha='center', va='bottom', 
                   fontweight='bold', fontsize=10)
        
        # Agregar línea de promedio
        mean_val = np.mean(data_for_stats)
        ax.axhline(y=mean_val, color='red', linestyle='--', alpha=0.7, 
                  linewidth=2, label=f'Promedio: {mean_val:.2f}')
        
        ax.set_title(chart_title or 'Gráfica de Barras Profesional', 
                    fontweight='bold', fontsize=16, pad=20)
        ax.set_xlabel('Categorías', fontweight='bold', fontsize=14)
        ax.set_ylabel('Valores', fontweight='bold', fontsize=14)
        ax.legend()
        ax.grid(True, alpha=0.3, axis='y', linestyle='--')
        
        plt.tight_layout()
        plt.show()
        return True
    
    def create_histogram(self, chart_data, chart_labels, chart_title):
        """Crea un histograma profesional con análisis estadístico completo"""
        data_result = self.processor.process_data(chart_data)
        if not data_result:
            return False
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
        
        # Seleccionar datos para el histograma
        if len(data_result) == 2:
            _, y_data = data_result
            data_to_plot = y_data
        else:
            data_to_plot = data_result[0]
        
        # Calcular número óptimo de bins usando la regla de Sturges
        n_bins = max(5, min(20, int(np.ceil(np.log2(len(data_to_plot)) + 1))))
        
        # Histograma principal
        n, bins, patches = ax1.hist(data_to_plot, bins=n_bins, alpha=0.7, 
                                   edgecolor='black', linewidth=1.2, density=True)
        
        # Colorear barras según frecuencia
        cm = plt.cm.viridis
        for i, p in enumerate(patches):
            p.set_facecolor(cm(n[i] / max(n) if max(n) > 0 else 0))
        
        # Agregar curva de densidad
        try:
            kde = stats.gaussian_kde(data_to_plot)
            x_range = np.linspace(data_to_plot.min(), data_to_plot.max(), 100)
            ax1.plot(x_range, kde(x_range), 'r-', linewidth=3, 
                    label='Densidad estimada (KDE)', alpha=0.8)
        except:
            pass
        
        # Líneas de estadísticas
        mean_val = np.mean(data_to_plot)
        std_val = np.std(data_to_plot)
        median_val = np.median(data_to_plot)
        
        ax1.axvline(mean_val, color='red', linestyle='--', linewidth=2, 
                   label=f'Media: {mean_val:.2f}')
        ax1.axvline(median_val, color='green', linestyle='--', linewidth=2, 
                   label=f'Mediana: {median_val:.2f}')
        ax1.axvline(mean_val + std_val, color='orange', linestyle=':', alpha=0.7, 
                   label=f'+1σ: {mean_val + std_val:.2f}')
        ax1.axvline(mean_val - std_val, color='orange', linestyle=':', alpha=0.7, 
                   label=f'-1σ: {mean_val - std_val:.2f}')
        
        ax1.set_title('Histograma con Análisis Estadístico', fontweight='bold', fontsize=14)
        ax1.set_xlabel('Valores', fontweight='bold')
        ax1.set_ylabel('Densidad', fontweight='bold')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Gráfica Q-Q para normalidad
        stats.probplot(data_to_plot, dist="norm", plot=ax2)
        ax2.set_title('Gráfica Q-Q (Prueba de Normalidad)', fontweight='bold', fontsize=14)
        ax2.grid(True, alpha=0.3)
        
        # Prueba de normalidad
        try:
            _, p_value = stats.shapiro(data_to_plot[:5000])  # Shapiro-Wilk (máximo 5000 muestras)
            normality_text = f'Shapiro-Wilk p-value: {p_value:.4f}\n'
            normality_text += 'Distribución Normal' if p_value > 0.05 else 'No Normal'
            ax2.text(0.05, 0.95, normality_text, transform=ax2.transAxes, 
                    fontsize=10, bbox=dict(boxstyle="round", facecolor='lightyellow', alpha=0.8))
        except:
            pass
        
        plt.suptitle(chart_title or 'Análisis de Distribución Profesional', 
                    fontweight='bold', fontsize=16)
        plt.tight_layout()
        plt.show()
        return True
    
    def create_scatter_plot(self, chart_data, chart_labels, chart_title):
        """Crea una gráfica de dispersión profesional con análisis de correlación"""
        data_result = self.processor.process_data(chart_data)
        if not data_result:
            return False
        
        fig, ax = plt.subplots(figsize=(12, 8))
        
        if len(data_result) == 2:
            x_data, y_data = data_result
            
            # Scatter plot con colores basados en densidad local
            scatter = ax.scatter(x_data, y_data, alpha=0.7, s=100, 
                               c=range(len(x_data)), cmap='viridis', 
                               edgecolors='black', linewidth=0.5)
            plt.colorbar(scatter, ax=ax, label='Índice de datos')
            
            # Línea de regresión
            if len(x_data) > 1:
                z = np.polyfit(x_data, y_data, 1)
                p = np.poly1d(z)
                ax.plot(x_data, p(x_data), "r--", alpha=0.8, linewidth=3, 
                       label=f'Regresión: y = {z[0]:.3f}x + {z[1]:.3f}')
                
                # Calcular R²
                y_pred = p(x_data)
                ss_res = np.sum((y_data - y_pred) ** 2)
                ss_tot = np.sum((y_data - np.mean(y_data)) ** 2)
                r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
                
                # Correlación y estadísticas
                correlation = np.corrcoef(x_data, y_data)[0, 1]
                stats_text = f'Correlación: {correlation:.3f}\nR²: {r_squared:.3f}\n'
                stats_text += f'Pendiente: {z[0]:.3f}\nIntercepto: {z[1]:.3f}'
                
                ax.text(0.05, 0.95, stats_text, transform=ax.transAxes, 
                       bbox=dict(boxstyle="round,pad=0.3", facecolor='lightblue', alpha=0.8),
                       verticalalignment='top', fontsize=11)
            
            ax.set_xlabel('X', fontweight='bold', fontsize=14)
            ax.set_ylabel('Y', fontweight='bold', fontsize=14)
            
        else:
            data = data_result[0]
            x_indices = np.arange(len(data))
            
            scatter = ax.scatter(x_indices, data, alpha=0.7, s=100, 
                               c=range(len(data)), cmap='viridis',
                               edgecolors='black', linewidth=0.5)
            plt.colorbar(scatter, ax=ax, label='Índice')
            
            # Línea de tendencia
            if len(data) > 1:
                z = np.polyfit(x_indices, data, 1)
                p = np.poly1d(z)
                ax.plot(x_indices, p(x_indices), "r--", alpha=0.8, linewidth=3, 
                       label=f'Tendencia: y = {z[0]:.3f}x + {z[1]:.3f}')
            
            ax.set_xlabel('Índice', fontweight='bold', fontsize=14)
            ax.set_ylabel('Valor', fontweight='bold', fontsize=14)
        
        ax.set_title(chart_title or 'Gráfica de Dispersión Profesional', 
                    fontweight='bold', fontsize=16, pad=20)
        ax.legend()
        ax.grid(True, alpha=0.3, linestyle='--')
        
        plt.tight_layout()
        plt.show()
        return True
    
    def create_pie_chart(self, chart_data, chart_labels, chart_title):
        """Crea una gráfica circular profesional con efectos visuales"""
        data_result = self.processor.process_data(chart_data)
        if not data_result:
            return False
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
        
        # Seleccionar datos
        if len(data_result) == 2:
            _, y_data = data_result
            values = np.abs(y_data)  # Asegurar valores positivos
        else:
            values = np.abs(data_result[0])
        
        # Filtrar valores muy pequeños
        threshold = np.sum(values) * 0.01  # 1% del total
        significant_indices = values >= threshold
        values_filtered = values[significant_indices]
        
        # Preparar etiquetas
        labels = self.processor.process_labels(chart_labels)
        if labels:
            labels_filtered = [labels[i] for i in range(len(labels)) if i < len(significant_indices) and significant_indices[i]]
        else:
            labels_filtered = [f'Categoría {i+1}' for i in range(len(values_filtered))]
        
        # Colores profesionales
        colors = plt.cm.Set3(np.linspace(0, 1, len(values_filtered)))
        
        # Gráfica circular con efectos
        wedges, texts, autotexts = ax1.pie(values_filtered, labels=labels_filtered, 
                                          autopct='%1.1f%%', colors=colors, 
                                          startangle=90, explode=[0.05] * len(values_filtered),
                                          shadow=True, textprops={'fontsize': 11})
        
        # Mejorar apariencia del texto
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
            autotext.set_fontsize(10)
        
        ax1.set_title('Distribución Porcentual', fontweight='bold', fontsize=14)
        
        # Crear gráfica de barras complementaria
        ax2.bar(range(len(values_filtered)), values_filtered, color=colors, alpha=0.8, 
               edgecolor='black', linewidth=0.8)
        ax2.set_xticks(range(len(values_filtered)))
        ax2.set_xticklabels(labels_filtered, rotation=45, ha='right')
        ax2.set_ylabel('Valores Absolutos', fontweight='bold')
        ax2.set_title('Valores Absolutos', fontweight='bold', fontsize=14)
        ax2.grid(True, alpha=0.3, axis='y')
        
        # Agregar estadísticas
        total = np.sum(values_filtered)
        max_val = np.max(values_filtered)
        max_idx = np.argmax(values_filtered)
        stats_text = f'Total: {total:.1f}\nMáximo: {max_val:.1f}\nCategoría dominante: {labels_filtered[max_idx]}'
        
        ax2.text(0.02, 0.98, stats_text, transform=ax2.transAxes, 
                bbox=dict(boxstyle="round", facecolor='lightyellow', alpha=0.8),
                verticalalignment='top', fontsize=10)
        
        plt.suptitle(chart_title or 'Análisis Circular Profesional', 
                    fontweight='bold', fontsize=16)
        plt.tight_layout()
        plt.show()
        return True
    
    def create_box_plot(self, chart_data, chart_labels, chart_title):
        """Crea un diagrama de caja profesional con análisis estadístico completo"""
        data_result = self.processor.process_data(chart_data)
        if not data_result:
            return False
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
        
        # Seleccionar datos
        if len(data_result) == 2:
            _, y_data = data_result
            data_to_plot = [y_data]
            labels_box = ['Datos Y']
        else:
            data_to_plot = [data_result[0]]
            labels_box = ['Datos']
        
        # Boxplot principal con personalización
        box_plot = ax1.boxplot(data_to_plot, labels=labels_box, patch_artist=True,
                              boxprops=dict(facecolor='lightblue', alpha=0.7, linewidth=2),
                              medianprops=dict(color='red', linewidth=3),
                              whiskerprops=dict(color='black', linewidth=2),
                              capprops=dict(color='black', linewidth=2),
                              flierprops=dict(marker='o', markerfacecolor='red', 
                                            markersize=8, alpha=0.7, markeredgecolor='black'))
        
        # Superponer puntos de datos
        data_flat = data_to_plot[0]
        y_jittered = np.random.normal(1, 0.04, size=len(data_flat))
        ax1.scatter(y_jittered, data_flat, alpha=0.4, s=30, color='darkblue')
        
        ax1.set_title('Diagrama de Caja con Distribución', fontweight='bold', fontsize=14)
        ax1.set_ylabel('Valores', fontweight='bold')
        ax1.grid(True, alpha=0.3, axis='y')
        
        # Agregar estadísticas descriptivas
        stats_dict = {
            'Media': np.mean(data_flat),
            'Mediana': np.median(data_flat),
            'Q1': np.percentile(data_flat, 25),
            'Q3': np.percentile(data_flat, 75),
            'IQR': np.percentile(data_flat, 75) - np.percentile(data_flat, 25),
            'Desv. Estándar': np.std(data_flat),
            'Mínimo': np.min(data_flat),
            'Máximo': np.max(data_flat),
            'Rango': np.max(data_flat) - np.min(data_flat)
        }
        
        stats_text = '\n'.join([f'{key}: {value:.2f}' for key, value in stats_dict.items()])
        ax1.text(0.02, 0.98, stats_text, transform=ax1.transAxes, 
                bbox=dict(boxstyle="round,pad=0.4", facecolor='wheat', alpha=0.9),
                verticalalignment='top', fontsize=10)
        
        # Histograma complementario
        ax2.hist(data_flat, bins=max(5, min(20, len(data_flat)//3)), 
                alpha=0.7, edgecolor='black', color='lightgreen')
        ax2.axvline(np.mean(data_flat), color='red', linestyle='--', linewidth=2, 
                   label=f'Media: {np.mean(data_flat):.2f}')
        ax2.axvline(np.median(data_flat), color='blue', linestyle='--', linewidth=2, 
                   label=f'Mediana: {np.median(data_flat):.2f}')
        
        ax2.set_title('Distribución de Frecuencias', fontweight='bold', fontsize=14)
        ax2.set_xlabel('Valores', fontweight='bold')
        ax2.set_ylabel('Frecuencia', fontweight='bold')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        plt.suptitle(chart_title or 'Análisis de Caja Profesional', 
                    fontweight='bold', fontsize=16)
        plt.tight_layout()
        plt.show()
        return True

# ===========================================
# FUNCIÓN PRINCIPAL DE INTERFAZ
# ===========================================

def generate_visualization():
    """
    Función principal que se ejecuta desde el navegador web
    Lee las variables globales establecidas por JavaScript y genera la visualización
    """
    try:
        # Crear instancia del generador de gráficas
        chart_generator = ProfessionalCharts()
        
        # Obtener variables globales (establecidas por JavaScript)
        chart_type = globals().get('chart_type', '').lower().strip()
        chart_data = globals().get('chart_data', '').strip()
        chart_labels = globals().get('chart_labels', '').strip()
        chart_title = globals().get('chart_title', '').strip()
        
        # Validación de entrada
        if not chart_type:
            print("❌ Error: Tipo de gráfica no especificado")
            return False
        
        if not chart_data:
            print("❌ Error: Datos no proporcionados")
            return False
        
        print(f"🔄 Generando gráfica tipo '{chart_type}' con título '{chart_title}'...")
        
        # Mapeo de tipos de gráfica a métodos
        chart_methods = {
            'line': chart_generator.create_line_chart,
            'bar': chart_generator.create_bar_chart,
            'histogram': chart_generator.create_histogram,
            'scatter': chart_generator.create_scatter_plot,
            'pie': chart_generator.create_pie_chart,
            'box': chart_generator.create_box_plot
        }
        
        # Ejecutar el método correspondiente
        if chart_type in chart_methods:
            success = chart_methods[chart_type](chart_data, chart_labels, chart_title)
            if success:
                print(f"✅ Gráfica '{chart_type}' generada exitosamente")
                return True
            else:
                print(f"❌ Error generando gráfica '{chart_type}'")
                return False
        else:
            print(f"❌ Tipo de gráfica '{chart_type}' no reconocido")
            print(f"Tipos disponibles: {', '.join(chart_methods.keys())}")
            return False
            
    except Exception as e:
        print(f"❌ Error crítico en generate_visualization: {e}")
        import traceback
        traceback.print_exc()
        return False

# ===========================================
# FUNCIÓN DE PRUEBA Y DEMOSTRACIÓN
# ===========================================

def test_all_visualizations():
    """
    Función para probar todas las visualizaciones con datos de ejemplo
    Útil para verificar que el sistema funciona correctamente
    """
    print("🧪 Iniciando pruebas del sistema de visualización...")
    
    test_data = {
        'line': {
            'data': '1,2;2,4;3,6;4,8;5,10;6,12;7,14;8,16',
            'labels': 'A,B,C,D,E,F,G,H',
            'title': 'Función Lineal y = 2x'
        },
        'bar': {
            'data': '10,15,23,11,18,25,30,8',
            'labels': 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago',
            'title': 'Ventas Mensuales 2024'
        },
        'histogram': {
            'data': '1,2,2,3,3,3,4,4,4,4,5,5,5,5,5,6,6,6,7,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
            'labels': '',
            'title': 'Distribución de Calificaciones'
        },
        'scatter': {
            'data': '1,2;2,5;3,3;4,8;5,7;6,11;7,9;8,15;9,12;10,18',
            'labels': '',
            'title': 'Relación Horas de Estudio vs Calificación'
        },
        'pie': {
            'data': '30,25,20,15,10',
            'labels': 'Matemáticas,Física,Química,Biología,Historia',
            'title': 'Distribución de Materias Preferidas'
        },
        'box': {
            'data': '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,30,35,40,45,50',
            'labels': '',
            'title': 'Análisis de Tiempos de Respuesta'
        }
    }
    
    chart_generator = ProfessionalCharts()
    
    for chart_type, config in test_data.items():
        print(f"\n📊 Probando gráfica tipo '{chart_type}'...")
        try:
            # Establecer variables globales como lo haría JavaScript
            globals()['chart_type'] = chart_type
            globals()['chart_data'] = config['data']
            globals()['chart_labels'] = config['labels']
            globals()['chart_title'] = config['title']
            
            # Generar visualización
            success = generate_visualization()
            
            if success:
                print(f"✅ Prueba '{chart_type}' exitosa")
            else:
                print(f"❌ Prueba '{chart_type}' falló")
                
        except Exception as e:
            print(f"❌ Error en prueba '{chart_type}': {e}")
    
    print("\n🎉 Pruebas completadas")

# ===========================================
# PUNTO DE ENTRADA PRINCIPAL
# ===========================================

# Ejecutar automáticamente si se detectan variables del navegador
if __name__ == "__main__" or 'chart_type' in globals():
    if 'chart_type' in globals():
        generate_visualization()
    else:
        print("🚀 Sistema de Visualización Profesional cargado")
        print("💡 Para probar el sistema, ejecuta: test_all_visualizations()")

# Descomenta la siguiente línea para ejecutar todas las pruebas automáticamente
# test_all_visualizations()