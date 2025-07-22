import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from scipy.interpolate import interp1d

# Investment parameters
annual_contribution = 20000
annual_rate = 0.06
years = 26
balances = [0]
for year in range(1, years):
    balances.append(balances[-1] * (1 + annual_rate) + annual_contribution)

df = pd.DataFrame({'Year': list(range(years)), 'Portfolio Value': balances})

# Interpolation setup
fps = 30
duration = 5  # seconds
total_frames = fps * duration

interp_func = interp1d(df['Year'], df['Portfolio Value'], kind='linear')
interp_years = np.linspace(df['Year'].min(), df['Year'].max(), total_frames)
interp_values = interp_func(interp_years)

# Plot setup
fig, ax = plt.subplots(figsize=(10, 6))
ax.set_xlim(0, 25)
ax.set_ylim(0, max(balances) * 1.1)
ax.set_facecolor('#121212')
fig.patch.set_facecolor('#121212')
ax.set_title('How $20K/Year Grows with 6% Returns', fontsize=14, color='white')
ax.set_xlabel('Year', fontsize=12, color='white')
ax.set_ylabel('Portfolio Value ($)', fontsize=12, color='white')
ax.tick_params(colors='white')

# Y-axis formatting
yticks = np.arange(0, max(balances) * 1.1, 100000)
ytick_labels = [f'${y/1e6:.1f}M' if y >= 1_000_000 else f'${int(y/1000)}k' for y in yticks]
ax.set_yticks(yticks)
ax.set_yticklabels(ytick_labels, color='white')
ax.yaxis.grid(True, alpha=0.3)
ax.xaxis.grid(False)

line, = ax.plot([], [], color='#90caf9', linewidth=2)
label = ax.text(0.95, 0.05, '', transform=ax.transAxes,
                ha='right', va='bottom', fontsize=12, color='#90caf9',
                bbox=dict(facecolor='#1e1e1e', edgecolor='none', pad=5))

def animate(i):
    x = interp_years[:i+1]
    y = interp_values[:i+1]
    line.set_data(x, y)
    if len(y):
        val = y[-1]
        label.set_text(f"Value: {'${:,.2f}M'.format(val / 1e6) if val >= 1_000_000 else '${:,.0f}'.format(val)}")
    return line, label

ani = animation.FuncAnimation(fig, animate, frames=total_frames, interval=1000/fps, blit=True)

# Save as MP4
ani.save('investment_growth_animation.mp4', writer='ffmpeg', fps=fps)
print("✅ Saved as investment_growth_animation.mp4")
